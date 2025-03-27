import { Box, IconButton, TextField, Typography, SxProps, Theme, TypographyVariant } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  variant?: TypographyVariant;
  sx?: SxProps<Theme>;
  format?: (value: string) => string;
}

export function EditableText({ 
  value, 
  onChange, 
  variant = 'body1', 
  sx, 
  format = (v) => v
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleRevert = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleRevert();
    }
  };

  if (!isEditing) {
    return (
      <Typography
        variant={variant}
        onClick={() => setIsEditing(true)}
        sx={{ 
          cursor: 'pointer',
          position: 'relative',
          '&:hover': { 
            bgcolor: 'action.hover',
            '& .edit-icon': { opacity: 1 }
          },
          p: 0.5,
          pr: 3,
          borderRadius: 1,
          ...sx
        }}
      >
        {format(value)}
        <EditIcon 
          sx={{ 
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0,
            fontSize: '0.9em',
            color: 'action.active',
            transition: 'opacity 0.2s'
          }}
          className="edit-icon"
        />
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <TextField
        inputRef={inputRef}
        size="small"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={sx}
        fullWidth
        InputProps={{
          endAdornment: (
            <>
              <IconButton size="small" onClick={handleSave} sx={{ color: 'success.main' }}>
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleRevert} sx={{ color: 'error.main' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          )
        }}
      />
    </Box>
  );
}
