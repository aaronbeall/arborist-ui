import { BaseAdapter } from './BaseAdapter';
import { DataFormat, TreeNode } from '../types';
import { parse, stringify } from 'yaml';

type YamlValue = string | number | boolean | null | YamlObject | YamlArray;
type YamlObject = { [key: string]: YamlValue };
type YamlArray = YamlValue[];

export class YamlAdapter extends BaseAdapter {
  format: DataFormat = 'yaml';

  async parse(source: string): Promise<TreeNode> {
    const data = parse(source);
    return this.convertToTree(data);
  }

  async stringify(tree: TreeNode): Promise<string> {
    const data = this.convertFromTree(tree);
    return stringify(data);
  }

  private convertToTree(data: YamlValue, name: string = 'root'): TreeNode {
    if (Array.isArray(data)) {
      return this.createNode(name, 'array', undefined, data.map(item => 
        this.convertToTree(item, '')
      ));
    } else if (typeof data === 'object' && data !== null) {
      return this.createNode(name, 'object', undefined, Object.entries(data).map(([key, value]) => 
        this.convertToTree(value, key)
      ));
    } else {
      return this.createNode(name, 'property', String(data));
    }
  }

  private convertFromTree(node: TreeNode): YamlValue {
    if (node.children) {
      if (node.type === 'array') {
        // For arrays, convert each child to an object using its children's names as keys
        return node.children.map(child => {
          if (child.children) {
            return Object.fromEntries(
              child.children.map(grandChild => [grandChild.name, this.convertFromTree(grandChild)])
            );
          }
          return this.convertFromTree(child);
        });
      } else {
        return Object.fromEntries(
          node.children.map(child => [child.name, this.convertFromTree(child)])
        );
      }
    } else {
      return node.value || null;
    }
  }
} 