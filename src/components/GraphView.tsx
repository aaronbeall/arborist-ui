import { Box } from '@mui/material';
import ReactFlow, { 
  Node, 
  Edge,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TreeNode } from '../types';
import { treeToFlow } from '../utils/treeToFlow';
import { useCallback } from 'react';
import { GraphNode as CustomTreeNode } from './GraphNode';

interface GraphViewProps {
  tree: TreeNode | null;
}

const nodeTypes = {
  treeNode: CustomTreeNode,
};

export function GraphView({ tree }: GraphViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = useCallback(() => {
    if (tree) {
      const { nodes: flowNodes, edges: flowEdges } = treeToFlow(tree);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [tree, setNodes, setEdges]);

  if (!tree) {
    return null;
  }

  return (
    <Box sx={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
            Drag to pan, scroll to zoom
          </Box>
        </Panel>
      </ReactFlow>
    </Box>
  );
}
