import { BaseAdapter } from './BaseAdapter';
import { DataFormat, TreeNode } from '../types';

export class JsonAdapter extends BaseAdapter {
  format: DataFormat = 'json';

  async parse(source: string): Promise<TreeNode> {
    const data = JSON.parse(source);
    return this.convertToTree(data);
  }

  async stringify(tree: TreeNode): Promise<string> {
    const data = this.convertFromTree(tree);
    return JSON.stringify(data, null, 2);
  }

  minify(source: string): string {
    const obj = JSON.parse(source);
    return JSON.stringify(obj);
  }

  private convertToTree(data: unknown, name: string = 'root'): TreeNode {
    if (Array.isArray(data)) {
      return this.createNode(name, 'array', undefined, data.map(item => 
        this.convertToTree(item, "")
      ));
    } else if (data && typeof data === 'object') {
      return this.createNode(name, 'object', undefined, Object.entries(data).map(([key, value]) => 
        this.convertToTree(value, key)
      ));
    } else {
      return this.createNode(name, 'property', data as string | number | boolean);
    }
  }

  private convertFromTree(node: TreeNode): unknown {
    if (node.type === 'array') {
      return node.children?.map(child => this.convertFromTree(child)) || [];
    } else if (node.type === 'object') {
      const result: Record<string, unknown> = {};
      node.children?.forEach(child => {
        result[child.name] = this.convertFromTree(child);
      });
      return result;
    } else if (node.type === 'property') {
      return node.value;
    }
    return null;
  }
}