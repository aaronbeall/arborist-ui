import { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { TreeNode } from '../types';

interface EditableNodeProps {
  node: TreeNode;
  onEdit: (node: TreeNode) => void;
}

export function EditableNode({ node, onEdit }: EditableNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.value || '');
  const [showEditButton, setShowEditButton] = useState(false);

  const handleSave = () => {
    onEdit({ ...node, value: editValue });
    setIsEditing(false);
  };

  const handleRevert = () => {
    setEditValue(node.value || '');
    setIsEditing(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRevert();
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing]);

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
                : {node.value}
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