import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { TreeNode } from '../types';
import { EditableNodeValue } from './EditableNodeValue';

interface EditableNodeProps {
  node: TreeNode;
  onEdit: (node: TreeNode) => void;
  showEditButton?: boolean;
  onEditButtonClick?: (e: React.MouseEvent) => void;
}

export function EditableNode({ node, onEdit, showEditButton, onEditButtonClick }: EditableNodeProps) {
  const [showEditButtonState, setShowEditButtonState] = useState(false);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        '&:hover .edit-button': {
          opacity: 1,
        },
      }}
      onMouseEnter={() => setShowEditButtonState(true)}
      onMouseLeave={() => setShowEditButtonState(false)}
    >
      <Box sx={{ 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' 
      }}>
        {node.name}
      </Box>
      {showEditButton && (
        <IconButton
          size="small"
          onClick={onEditButtonClick}
          sx={{ ml: 1, opacity: 0.7 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
      {node.value !== undefined && (
        <EditableNodeValue node={node} onEdit={onEdit} />
      )}
    </Box>
  );
}