import React from 'react';
import { Box, Collapse, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NodeValue, TreeNode } from '../types';
import { EditableNode } from './EditableNode';
import { NodeTypeIcon } from './NodeTypeIcon';

interface TreeProps {
  node: TreeNode;
  level?: number;
  onNodeUpdate: (node: TreeNode) => void;
  arrayIndex?: number;
  expandedNodes: Set<string>;
  onExpandedNodesChange: (nodes: Set<string>) => void;
  matchedNodes?: Set<string>;
  visibleNodes?: Set<string>;
  onEditNode?: (node: TreeNode) => void;
  editingNodeId?: string;
}

export function Tree({ node, level = 0, onNodeUpdate, expandedNodes, onExpandedNodesChange, arrayIndex, matchedNodes, visibleNodes, onEditNode, editingNodeId }: TreeProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    onExpandedNodesChange(newExpanded);
  };

  const getNodeName = () => {
    if (node.type === 'array') {
      return `${node.name} (${node.children?.length || 0})`;
    }
    if (arrayIndex !== undefined) {
      return `[${arrayIndex}]`;
    }
    return node.name;
  };

  // Hide nodes that aren't in the visible set when filtering
  if (visibleNodes && !visibleNodes.has(node.id)) {
    return null;
  }

  return (
    <Box sx={{ ml: level ? 2 : 0 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: editingNodeId === node.id ? 'primary.main' : 
                   matchedNodes?.has(node.id) ? 'action.selected' : 
                   'transparent',
          color: editingNodeId === node.id ? 'primary.contrastText' : 'inherit',
          borderRadius: 1,
          '&:hover': {
            bgcolor: editingNodeId === node.id ? 'primary.dark' : 'action.hover',
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={() => handleToggle(node.id)}
            sx={{ p: 0.5, minWidth: 24 }}
          >
            {expandedNodes.has(node.id) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 24 }} />}
        <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>
          <NodeTypeIcon 
            node={node}
            isExpanded={expandedNodes.has(node.id)}
            onNodeUpdate={onNodeUpdate}
          />
        </Box>
        <EditableNode
          node={{ ...node, name: getNodeName() }}
          onEdit={onNodeUpdate}
          showEditButton={isHovered && (node.type === 'object' || node.type === 'array')}
          onEditButtonClick={(e) => {
            e.stopPropagation();
            onEditNode?.(node);
          }}
        />
      </Box>
      {hasChildren && (
        <Collapse in={expandedNodes.has(node.id)}>
          {node.children?.map((child, index) => (
            <Tree
              key={child.id}
              node={child}
              level={level + 1}
              onNodeUpdate={onNodeUpdate}
              arrayIndex={node.type === 'array' ? index : undefined}
              expandedNodes={expandedNodes}
              onExpandedNodesChange={onExpandedNodesChange}
              matchedNodes={matchedNodes}
              visibleNodes={visibleNodes}
              onEditNode={onEditNode}
              editingNodeId={editingNodeId}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}