import { NodeValue, TreeNode } from "../types";

const walk = (tree: TreeNode, callback: (node: TreeNode, parent?: TreeNode) => void, parent?: TreeNode) => {
  callback(tree, parent);
  tree.children?.forEach(child => walk(child, callback, tree));
};

export const removeTreeNodeArrayElementNames = (tree: TreeNode, parentName?: string) => {
  walk(tree, (node, parent) => {
    if (parent?.type === 'array' && (!parentName || parent?.name === parentName)) {
      node.name = "";
    }
  });
  return tree;
};

export const transformTreeNodeValues = (tree: TreeNode, transform: (value?: NodeValue) => NodeValue | undefined) => {
  walk(tree, node => {
    node.value = transform(node.value);
  });
  return tree;
}

export const stringifyAllTreeNodeValues = (tree: TreeNode) =>
  transformTreeNodeValues(tree, value => value != undefined ? String(value) : undefined);