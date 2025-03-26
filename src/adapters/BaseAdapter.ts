import { DataAdapter, DataFormat, TreeNode, NodeType } from '../types';
import { generateId } from '../utils/idGenerator';

export abstract class BaseAdapter implements DataAdapter {
  abstract format: DataFormat;
  abstract parse(source: string): Promise<TreeNode>;
  abstract stringify(tree: TreeNode): Promise<string>;

  protected createNode(name: string, type: NodeType, value?: string | number | boolean, children?: TreeNode[], attributes?: Record<string, string>): TreeNode {
    return {
      id: generateId(),
      name,
      value,
      children,
      attributes,
      type
    };
  }
}