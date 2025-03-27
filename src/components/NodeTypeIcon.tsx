import React from 'react';
import { IconButton } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { NodeValue, TreeNode } from '../types';
import { TypeSelector } from './TypeSelector';

interface NodeTypeIconProps {
  node: TreeNode;
  isExpanded?: boolean;
  onNodeUpdate: (node: TreeNode) => void;
}

export function NodeTypeIcon({ node, isExpanded, onNodeUpdate }: NodeTypeIconProps) {
  const [typeMenuAnchor, setTypeMenuAnchor] = React.useState<null | HTMLElement>(null);

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

  if (node.type === 'array') {
    return isExpanded ? <ListIcon color="primary" /> : <ListIcon color="action" />;
  } else if (node.type === 'object') {
    return isExpanded ? <FolderOpenIcon color="primary" /> : <FolderIcon color="action" />;
  } else if (node.value !== undefined) {
    const icon = typeof node.value === 'number' ? <NumbersIcon color="action" />
      : typeof node.value === 'boolean' ? <CheckBoxIcon color="action" />
      : <TextFieldsIcon color="action" />;
    
    return (
      <>
        <IconButton size="small" onClick={handleTypeClick} sx={{ p: 0 }}>
          {icon}
        </IconButton>
        <TypeSelector
          anchorEl={typeMenuAnchor}
          onClose={() => setTypeMenuAnchor(null)}
          onTypeSelect={handleTypeSelect}
        />
      </>
    );
  }
  return null;
}
