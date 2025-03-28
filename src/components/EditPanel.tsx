import { Box, IconButton, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChevronRight } from '@mui/icons-material';
import { useEffect, useRef } from 'react';
import { EditableNodeValue } from './EditableNodeValue';
import { NodeTypeIcon } from './NodeTypeIcon';
import { TreeNode } from '../types';

interface EditPanelProps {
  node: TreeNode;
  onClose: () => void;
  onNodeSelect: (node: TreeNode) => void;
  parentNodes?: TreeNode[];
  onNodeUpdate: (node: TreeNode) => void;
}

export function EditPanel({ node, onClose, onNodeSelect, parentNodes = [], onNodeUpdate }: EditPanelProps) {
  const pathPaperRef = useRef<HTMLDivElement>(null);

  const rows = node.children?.map((child, index) => ({ 
    key: node.type === 'array' ? `${ child.name }[${ index }]` : child.name,
    node: child
  })) ?? [];

  const renderNodeValue = (node: TreeNode) => {
    if (node.type === 'array' || node.type === 'object') {
      return (
        <Button
          size="small"
          onClick={() => onNodeSelect?.(node)}
          sx={{ justifyContent: 'flex-start' }}
        >
          {node.type === 'array' ? `Array(${node.children?.length ?? 0})` : 'Object'}
        </Button>
      );
    }
    return <EditableNodeValue node={node} onEdit={onNodeUpdate} />;
  };

  useEffect(() => {
    if (pathPaperRef.current) {
      pathPaperRef.current.scrollTop = pathPaperRef.current.scrollHeight;
    }
  }, [node]);

  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NodeTypeIcon node={node} isExpanded onNodeUpdate={onNodeUpdate} />
            <Typography variant="h6">{node.name}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {parentNodes.length > 0 && (
          <Paper 
            ref={pathPaperRef}
            variant="outlined" 
            sx={{ 
              p: 1,
              maxHeight: '4.5em',
              overflow: 'auto',
              fontSize: '0.75rem',
              borderRadius: 0,
              borderLeft: 0,
              borderRight: 0
            }}
          >
            {parentNodes.map((parent, i) => (
              <Box key={parent.id} sx={{ 
                display: 'flex', 
                alignItems: 'center',
                ml: i * 1.5,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                cursor: 'pointer',
                typography: 'caption'
              }} onClick={() => onNodeSelect?.(parent)}>
                <ChevronRight sx={{ fontSize: '0.9em', mr: 0.5 }} />
                {parent.name}
              </Box>
            ))}
          </Paper>
        )}
      </Box>
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ 
              bgcolor: 'action.selected',
              '& th': { 
                fontWeight: 'bold',
                borderBottom: 2,
                borderColor: 'divider',
                py: 1.5,
                typography: 'subtitle2'
              } 
            }}>
              <TableCell>{node.type === 'array' ? 'Index' : 'Key'}</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map(({ key, node }) => (
              <TableRow key={node.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NodeTypeIcon node={node} onNodeUpdate={onNodeUpdate} />
                    {key}
                  </Box>
                </TableCell>
                <TableCell>{renderNodeValue(node)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
