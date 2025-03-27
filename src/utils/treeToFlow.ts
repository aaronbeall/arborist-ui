import { Node, Edge } from 'reactflow';
import { TreeNode } from '../types';

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export function treeToFlow(tree: TreeNode): FlowData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levelNodes = new Map<number, TreeNode[]>();
  
  // First pass: group nodes by level
  function groupByLevel(node: TreeNode, level: number) {
    // Skip property nodes that belong to object parents
    if (node.type === 'property') {
      return;
    }
    
    const levelArray = levelNodes.get(level) || [];
    levelArray.push(node);
    levelNodes.set(level, levelArray);
    
    if (node.children) {
      // Only process children if current node is not an object, or if child is not a property
      node.children
        .filter(child => !(node.type === 'object' && child.type === 'property'))
        .forEach(child => groupByLevel(child, level + 1));
    }
  }
  groupByLevel(tree, 0);
  
  // Calculate max width needed
  const maxNodesInLevel = Math.max(...Array.from(levelNodes.values()).map(n => n.length));
  const horizontalSpacing = 200;
  const verticalSpacing = 100;
  const totalWidth = Math.max(maxNodesInLevel * horizontalSpacing, 800);
  
  // Second pass: position nodes
  levelNodes.forEach((nodesInLevel, level) => {
    const levelWidth = nodesInLevel.length;
    const startX = (totalWidth - (levelWidth - 1) * horizontalSpacing) / 2;
    
    nodesInLevel.forEach((node, index) => {
      const nodeId = node.id.toString();
      const properties = node.type === 'object' 
        ? node.children?.filter(child => child.type === 'property')
          .reduce((acc, prop) => ({
            ...acc,
            [prop.name || prop.id]: prop.value || prop.name || prop.id
          }), {})
        : undefined;

      const elements = node.type === 'array'
        ? node.children?.reduce((acc, child, idx) => ({
            ...acc,
            [`${ child.name ?? "" }[${ idx }]`]: child.type == "property" ? child.value : `{ ${ child.name } }`
          }), {})
        : undefined;

      nodes.push({
        id: nodeId,
        position: {
          x: startX + index * horizontalSpacing,
          y: level * verticalSpacing,
        },
        data: { 
          label: node.name || node.type,
          properties,
          elements,
          type: node.type,
        },
        type: 'treeNode',
      });
      
      if (node.children) {
        // Only create edges for non-property children
        node.children
          .filter(child => !(node.type === 'object' && child.type === 'property'))
          .forEach(child => {
            edges.push({
              id: `${nodeId}-${child.id}`,
              source: nodeId,
              target: child.id.toString(),
              type: 'smoothstep',
            });
          });
      }
    });
  });

  return { nodes, edges };
}
