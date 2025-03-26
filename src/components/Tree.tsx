import React from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ListIcon from '@mui/icons-material/List';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { TreeNode } from '../types';
import { EditableNode } from './EditableNode';

interface TreeProps {
  node: TreeNode;
  level?: number;
  onNodeUpdate: (updatedNode: TreeNode) => void;
  arrayIndex?: number;
}

export function Tree({ node, level = 0, onNodeUpdate, arrayIndex }: TreeProps) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const getNodeIcon = () => {
    if (node.type === 'array') {
      return expanded ? <ListIcon color="primary" /> : <ListIcon color="action" />;
    } else if (node.type === 'object') {
      return expanded ? <FolderOpenIcon color="primary" /> : <FolderIcon color="action" />;
    } else if (typeof node.value === 'number') {
      return <NumbersIcon color="action" />;
    } else if (typeof node.value === 'boolean') {
      return <CheckBoxIcon color="action" />;
    } else if (typeof node.value === 'string') {
      return <TextFieldsIcon color="action" />;
    } else {
      return <TextFieldsIcon color="action" />;
    }
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
            onClick={handleToggle}
            sx={{ p: 0.5, minWidth: 24 }}
          >
            {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 24 }} />}
        {getNodeIcon()}
        <EditableNode
          node={{ ...node, name: getNodeName() }}
          onEdit={onNodeUpdate}
        />
      </Box>
      {hasChildren && (
        <Collapse in={expanded}>
          {node.children?.map((child, index) => (
            <Tree
              key={child.id}
              node={child}
              level={level + 1}
              onNodeUpdate={onNodeUpdate}
              arrayIndex={node.type === 'array' ? index : undefined}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}