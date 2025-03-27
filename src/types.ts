export type DataFormat = 'json' | 'xml' | 'yaml' | 'javascript';

export type NodeType = 'array' | 'object' | 'property';

export type NodeValue = string | number | boolean;

export interface TreeNode {
  id: string;
  name: string;
  value?: NodeValue;
  children?: TreeNode[];
  type: NodeType;
}

export interface DataAdapter {
  parse: (source: string) => Promise<TreeNode>;
  stringify: (tree: TreeNode) => Promise<string>;
  format: DataFormat;
  minify(source: string): Promise<string>;
}

export interface HistoryState {
  source: string;
  tree: TreeNode;
  format: DataFormat;
}