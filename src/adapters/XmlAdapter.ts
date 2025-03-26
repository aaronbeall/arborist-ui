import { BaseAdapter } from './BaseAdapter';
import { DataFormat, TreeNode } from '../types';
import { parseString, Builder } from 'xml2js';
import { singular } from 'pluralize';

interface XmlAttributes {
  [key: string]: string;
}

interface XmlNode {
  $?: XmlAttributes;
  [key: string]: XmlNode | string | XmlNode[] | undefined;
}

interface XmlResult {
  [key: string]: XmlNode;
}

export class XmlAdapter extends BaseAdapter {
  format: DataFormat = 'xml';

  async parse(source: string): Promise<TreeNode> {
    console.log("[PARSE XML]", { source })
    return new Promise((resolve, reject) => {
      parseString(source, { explicitArray: false }, (err, result: XmlResult) => {
        if (err) {
          reject(new Error('Invalid XML format'));
          return;
        }
        resolve(this.convertToTree(result));
      });
    });
  }

  async stringify(tree: TreeNode): Promise<string> {
    const data = this.convertFromTree(tree);
    const builder = new Builder({ renderOpts: { pretty: true, indent: '  ' } });
    return builder.buildObject(data);
  }

  private convertToTree(data: XmlResult): TreeNode {
    const rootKey = Object.keys(data)[0];
    const rootNode = data[rootKey];
    return this.processNode(rootKey, rootNode);
  }

  private processNode(name: string, node: XmlNode | string | XmlNode[]): TreeNode {
    // Handle string values
    if (typeof node === 'string') {
      return this.createNode(name, 'property', node);
    }

    // Handle arrays
    if (Array.isArray(node)) {
      const children = node.map(item => this.processNode(name, item));
      return this.createNode(name, 'array', undefined, children);
    }

    // Handle objects
    if (node && typeof node === 'object') {
      const hasArrays = Object.values(node).some(v => Array.isArray(v));
      
      if (hasArrays) {
        // Process as array node if it contains array properties
        const children: TreeNode[] = [];
        Object.entries(node).forEach(([key, value]) => {
          if (key === '$') return; // Skip attributes
          if (Array.isArray(value)) {
            value.forEach(item => {
              children.push(this.processNode(key, item));
            });
          }
        });
        return this.createNode(name, 'array', undefined, children);
      } else {
        // Process as regular object
        const children: TreeNode[] = [];
        
        // Handle attributes
        if (node.$) {
          Object.entries(node.$).forEach(([key, value]) => {
            children.push(this.createNode(key, 'property', value));
          });
        }
        
        // Handle other properties
        Object.entries(node).forEach(([key, value]) => {
          if (key === '$') return;
          if (key === '_') {
            children.push(this.createNode('text', 'property', String(value)));
          } else {
            children.push(this.processNode(key, value ?? ""));
          }
        });
        
        return this.createNode(name, 'object', undefined, children);
      }
    }

    // Fallback for any other cases
    return this.createNode(name, 'property', String(node));
  }

  private isArrayLikeNode(node: XmlNode): boolean {
    if (!node || typeof node !== 'object') return false;
    // Check if any of the node's values are arrays
    return Object.values(node).some(value => Array.isArray(value));
  }

  private processXmlNode(node: XmlNode): TreeNode[] {
    if (!node) return [];

    const children: TreeNode[] = [];
    const attributes = node.$ || {};

    // Handle attributes
    Object.entries(attributes).forEach(([key, value]) => {
      children.push(this.createNode(key, 'property', value));
    });

    // Handle child nodes
    Object.entries(node).forEach(([key, value]) => {
      if (key === '$') return; // Skip attributes
      if (key === '_') {
        // Text content
        children.push(this.createNode('text', 'property', String(value)));
        return;
      }

      if (typeof value === 'object') {
        if (this.isArrayLikeNode(value as XmlNode)) {
          // Process each array property in the node
          const arrayChildren: TreeNode[] = [];
          Object.entries(value as XmlNode).forEach(([arrayKey, arrayValue]) => {
            if (Array.isArray(arrayValue)) {
              arrayValue.forEach(arrayItem => {
                arrayChildren.push(this.createNode(arrayKey, "object", undefined, this.processXmlNode(arrayItem)));
              });
            } else {
              arrayChildren.push(...this.processXmlNode(arrayValue as XmlNode));
            }
          });
          children.push(this.createNode(key, 'array', undefined, arrayChildren));
        } else {
          // Handle regular nested object
          children.push(
            this.createNode(key, 'object', undefined, this.processXmlNode(value as XmlNode))
          );
        }
      } else {
        // Handle simple value
        children.push(this.createNode(key, 'property', String(value)));
      }
    });

    return children;
  }

  private inferArrayItemName(parentName: string): string {
    const singularName = singular(parentName);
    return singularName === parentName ? `${parentName}-item` : singularName;
  }

  private convertFromTree = (node: TreeNode): XmlNode => {
    if (!node) return {};

    if (node.type === 'property') {
      return { [node.name]: String(node.value) };
    }

    if (node.type === 'array') {
      // Group children by name, inferring name if blank
      const groupedChildren = node.children?.reduce((groups, child) => {
        const name = child.name || this.inferArrayItemName(node.name);
        if (!groups[name]) {
          groups[name] = [];
        }
        const groupedNodes = groups[name] as XmlNode[keyof XmlNode][];
        const childNode = this.convertFromTree({...child, name});
        groupedNodes.push(childNode[name]);
        return groups;
      }, {} as XmlNode) || {};

      return { [node.name]: groupedChildren };
    }

    // Object type - reduce children into a single object
    const result = node.children?.reduce((acc, child) => {
      return { ...acc, ...this.convertFromTree(child) };
    }, {}) || {};

    return node.name ? { [node.name]: result } : result;
  }
}