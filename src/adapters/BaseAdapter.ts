import { DataAdapter, DataFormat, TreeNode, NodeType, NodeValue } from '../types';
import { generateId } from '../utils/idGenerator';

export abstract class BaseAdapter implements DataAdapter {
  abstract format: DataFormat;
  abstract parse(source: string): Promise<TreeNode>;
  abstract stringify(tree: TreeNode): Promise<string>;
  abstract minify(source: string): Promise<string>;

  protected createNode(name: string, type: NodeType, value?: NodeValue, children?: TreeNode[]): TreeNode {
    return {
      id: generateId(),
      name,
      value,
      children,
      type
    };
  }
}