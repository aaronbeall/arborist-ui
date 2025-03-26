import { NodeValue, TreeNode } from "../types";

const walk = (tree: TreeNode, callback: (node: TreeNode, parent?: TreeNode) => void, parent?: TreeNode) => {
  callback(tree, parent);
  tree.children?.forEach(child => walk(child, callback, tree));
};

export const setTreeNodeArrayElementNames = (tree: TreeNode, name: string, parentName?: string) => {
  walk(tree, (node, parent) => {
    if (parent?.type === 'array' && (!parentName || parent?.name === parentName)) {
      node.name = name;
    }
  });
  return tree;
};

export const transformTreeNodeValues = (tree: TreeNode, map: (value?: NodeValue) => NodeValue | undefined) => {
  walk(tree, node => {
    node.value = map(node.value);
  });
  return tree;
}

export const stringifyAllTreeNodeValues = (tree: TreeNode) =>
  transformTreeNodeValues(tree, value => value != undefined ? String(value) : undefined);