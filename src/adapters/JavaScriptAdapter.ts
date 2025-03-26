import { DataFormat, NodeValue, TreeNode } from '../types';
import { BaseAdapter } from './BaseAdapter';

type ParsedJsonValue = string | number | boolean | null | { [key: string]: ParsedJsonValue } | ParsedJsonValue[];

type ParsableJsonValue = ParsedJsonValue | undefined | { [key: string]: ParsableJsonValue } | ParsableJsonValue[];

export class JavaScriptAdapter extends BaseAdapter {
  format: DataFormat = 'javascript';

  async parse(source: string): Promise<TreeNode> {
    try {
      const sanitizedSource = source.trim().replace(/^return\s+/, '');
      const result = new Function(`
        "use strict";
        const window = undefined;
        const global = undefined;
        const document = undefined;
        return ${sanitizedSource};
      `)();

      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid JavaScript: must be an object or array');
      }

      const tree = this.toTreeNode(result);
      return tree;
    } catch (error) {
      throw new Error(`Invalid JavaScript: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async stringify(tree: TreeNode): Promise<string> {
    const obj = this.fromTreeNode(tree);
    return this.stringifyValue(obj);
  }

  private toTreeNode(value: ParsedJsonValue, name: string = 'root'): TreeNode {
    if (Array.isArray(value)) {
      return this.createNode(name, 'array', undefined, 
        value.map((item) => this.toTreeNode(item, ''))
      );
    }
    
    if (value && typeof value === 'object') {
      return this.createNode(name, 'object', undefined,
        Object.entries(value).map(([key, val]) => 
          this.toTreeNode(val, key)
        )
      );
    }

    return this.createNode(name, 'property', value === null ? undefined : value as NodeValue);
  }

  private fromTreeNode(node: TreeNode): ParsableJsonValue {
    if (node.type === 'array' && node.children) {
      return node.children.map(child => this.fromTreeNode(child));
    }
    
    if (node.type === 'object' && node.children) {
      return Object.fromEntries(
        node.children.map(child => [child.name, this.fromTreeNode(child)])
      );
    }

    // if (node.type === 'number') return Number(node.value);
    // if (node.type === 'boolean') return node.value === 'true';
    // if (node.type === 'undefined') return undefined;
    // if (node.type === 'null') return null;
    return node.value;
  }

  private stringifyValue(value: ParsableJsonValue, indent: number = 0): string {
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(item => this.stringifyValue(item, indent + 2));
      return `[\n${' '.repeat(indent + 2)}${items.join(',\n' + ' '.repeat(indent + 2))}\n${' '.repeat(indent)}]`;
    }
    
    if (value && typeof value === 'object') {
      if (Object.keys(value).length === 0) return '{}';
      const entries = Object.entries(value).map(([key, val]) => {
        const validId = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
        const formattedKey = validId ? key : `'${key}'`;
        return `${formattedKey}: ${this.stringifyValue(val, indent + 2)}`;
      });
      return `{\n${' '.repeat(indent + 2)}${entries.join(',\n' + ' '.repeat(indent + 2))}\n${' '.repeat(indent)}}`;
    }

    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    return String(value);
  }
}
