import { TreeNode } from '../types';

export function findNodeById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  return root.children?.reduce<TreeNode | null>(
    (found, child) => found || findNodeById(child, id), 
    null
  ) || null;
}

export function findParentPath(root: TreeNode, target: TreeNode): TreeNode[] {
  const path: TreeNode[] = [];
  
  const visit = (current: TreeNode): boolean => {
    if (current.id === target.id) {
      return true;
    }
    if (current.children) {
      for (const child of current.children) {
        if (visit(child)) {
          path.push(current);
          return true;
        }
      }
    }
    return false;
  };

  visit(root);
  return path.reverse();
}

function findMatchingNodes(node: TreeNode, filter: string): Set<string> {
  const matches = new Set<string>();
  const filterLower = filter.toLowerCase();

  const visit = (node: TreeNode) => {
    const nameMatch = node.name.toLowerCase().includes(filterLower);
    const valueMatch = node.value !== undefined && String(node.value).toLowerCase().includes(filterLower);
    
    if (nameMatch || valueMatch) {
      matches.add(node.id);
    }
    node.children?.forEach(visit);
  };

  visit(node);
  return matches;
}

function buildParentMap(node: TreeNode): Map<string, TreeNode> {
  const parentMap = new Map<string, TreeNode>();
  
  const visit = (node: TreeNode, parent?: TreeNode) => {
    if (parent) {
      parentMap.set(node.id, parent);
    }
    node.children?.forEach(child => visit(child, node));
  };
  
  visit(node);
  return parentMap;
}

function collectAncestors(node: TreeNode, targetIds: Set<string>): Set<string> {
  const ancestors = new Set<string>();
  const parentMap = buildParentMap(node);

  targetIds.forEach(id => {
    let current = parentMap.get(id);
    while (current) {
      ancestors.add(current.id);
      current = parentMap.get(current.id);
    }
  });

  return ancestors;
}

function collectDescendants(node: TreeNode, targetIds: Set<string>): Set<string> {
  const descendants = new Set<string>();

  const visit = (node: TreeNode, isDescendant: boolean) => {
    if (isDescendant || targetIds.has(node.id)) {
      descendants.add(node.id);
      node.children?.forEach(child => visit(child, true));
    } else {
      node.children?.forEach(child => visit(child, false));
    }
  };

  visit(node, false);
  return descendants;
}

export function getFilteredNodes(node: TreeNode, filter: string) {
  const matches = findMatchingNodes(node, filter);
  const ancestors = collectAncestors(node, matches);
  const descendants = collectDescendants(node, matches);

  return {
    matches,
    visible: new Set([...matches, ...ancestors, ...descendants]),
    expandedParents: ancestors
  };
}

export function collectAllIds(node: TreeNode): Set<string> {
  const allIds = new Set<string>();
  
  const visit = (node: TreeNode) => {
    allIds.add(node.id);
    node.children?.forEach(visit);
  };
  
  visit(node);
  return allIds;
}
