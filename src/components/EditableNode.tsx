import { useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { TreeNode } from '../types';

interface EditableNodeProps {
  node: TreeNode;
  onEdit: (node: TreeNode) => void;
}

export function EditableNode({ node, onEdit }: EditableNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(node.value || ''));
  const [showEditButton, setShowEditButton] = useState(false);

  const handleSave = () => {
    let newValue: string | number | boolean = editValue;

    // Try to preserve the original type
    if (typeof node.value === 'number') {
      const num = Number(editValue);
      // Only use number if it can be converted without data loss
      if (!isNaN(num) && String(num) === editValue) {
        newValue = num;
      }
    } else if (typeof node.value === 'boolean') {
      const lower = editValue.toLowerCase();
      if (lower === 'true') newValue = true;
      else if (lower === 'false') newValue = false;
    }

    onEdit({ ...node, value: newValue });
    setIsEditing(false);
  };

  const handleRevert = () => {
    setEditValue(String(node.value || ''));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleRevert();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        flex: 1,
        '&:hover .edit-button': {
          opacity: 1,
        },
      }}
      onMouseEnter={() => setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
    >
      <Typography variant="body2" sx={{ fontWeight: node.children ? 'bold' : 'normal' }}>
        {node.name}
      </Typography>
      {node.value !== undefined && (
        <>
          {isEditing ? (
            <>
              <TextField
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ minWidth: 100 }}
                autoFocus
              />
              <IconButton size="small" onClick={handleSave} color="success">
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleRevert} color="error">
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                : {String(node.value)}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setIsEditing(true)}
                className="edit-button"
                sx={{ 
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </>
      )}
    </Box>
  );
}