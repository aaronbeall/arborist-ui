import React from 'react';
import { Box, Collapse, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ListIcon from '@mui/icons-material/List';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { NodeValue, TreeNode } from '../types';
import { EditableNode } from './EditableNode';
import { TypeSelector } from './TypeSelector';

interface TreeProps {
  node: TreeNode;
  level?: number;
  onNodeUpdate: (node: TreeNode) => void;
  arrayIndex?: number;
  expandedNodes: Set<string>;
  onExpandedNodesChange: (nodes: Set<string>) => void;
}

export function Tree({ node, level = 0, onNodeUpdate, expandedNodes, onExpandedNodesChange, arrayIndex }: TreeProps) {
  const [typeMenuAnchor, setTypeMenuAnchor] = React.useState<null | HTMLElement>(null);
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

  const handleTypeClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTypeMenuAnchor(event.currentTarget);
  };

  const handleTypeSelect = (newType: NodeValue) => {
    let convertedValue = node.value;
    
    switch (newType) {
      case 'string':
        convertedValue = String(node.value);
        break;
      case 'number':
        convertedValue = Number(node.value) || 0;
        break;
      case 'boolean':
        convertedValue = Boolean(node.value);
        break;
    }

    onNodeUpdate({ ...node, value: convertedValue });
  };

  const getNodeIcon = () => {
    if (node.type === 'array') {
      return expandedNodes.has(node.id) ? <ListIcon color="primary" /> : <ListIcon color="action" />;
    } else if (node.type === 'object') {
      return expandedNodes.has(node.id) ? <FolderOpenIcon color="primary" /> : <FolderIcon color="action" />;
    } else if (node.value !== undefined) {
      // For property nodes, return clickable type icon
      const icon = typeof node.value === 'number' ? <NumbersIcon color="action" />
        : typeof node.value === 'boolean' ? <CheckBoxIcon color="action" />
        : <TextFieldsIcon color="action" />;
      
      return (
        <IconButton size="small" onClick={handleTypeClick} sx={{ p: 0 }}>
          {icon}
        </IconButton>
      );
    }
    return null;
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

  return (
    <Box sx={{ ml: level ? 2 : 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          {getNodeIcon()}
        </Box>
        <EditableNode
          node={{ ...node, name: getNodeName() }}
          onEdit={onNodeUpdate}
        />
      </Box>
      <TypeSelector
        anchorEl={typeMenuAnchor}
        onClose={() => setTypeMenuAnchor(null)}
        onTypeSelect={handleTypeSelect}
      />
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
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}