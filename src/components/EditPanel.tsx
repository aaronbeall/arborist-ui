import { Box, IconButton, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Breadcrumbs, Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChevronRight } from '@mui/icons-material';
import { EditableNodeValue } from './EditableNodeValue';
import { NodeTypeIcon } from './NodeTypeIcon';
import { TreeNode } from '../types';
import { EditableText } from './EditableText';
import { useState } from 'react';
import { getUniqueKeyName } from '../utils/treeUtils';

interface EditPanelProps {
  node: TreeNode;
  onClose: () => void;
  onNodeSelect: (node: TreeNode) => void;
  parentNodes?: TreeNode[];
  onNodeUpdate: (node: TreeNode) => void;
}

export function EditPanel({ node, onClose, onNodeSelect, parentNodes = [], onNodeUpdate }: EditPanelProps) {
  const [alertOpen, setAlertOpen] = useState(false);

  const rows = node.children?.map((child, index) => ({ 
    key: node.type === 'array' ? `${ child.name }[${ index }]` : child.name,
    child
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

  const handleKeyUpdate = (childNode: TreeNode, newKey: string) => {
    if (childNode.name === newKey) return;
    
    const uniqueKey = getUniqueKeyName(newKey, node);
    if (uniqueKey !== newKey) {
      setAlertOpen(true);
    }
    onNodeUpdate({ ...childNode, name: uniqueKey });
  };

  return (
    <>
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 2, pt: 1, pb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, mr: 1 }}>
              {parentNodes.length > 0 && (
                <Breadcrumbs
                  sx={{
                    '& .MuiBreadcrumbs-ol': { 
                      flexWrap: 'wrap',
                      gap: 0.25,
                      lineHeight: 0.8
                    },
                    '& .MuiBreadcrumbs-li': { 
                      minWidth: 0,
                      color: 'text.disabled',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                      '& p': {
                        fontSize: '0.8rem',
                        lineHeight: '1em'
                      }
                    },
                    '& .MuiBreadcrumbs-separator': {
                      mx: 0.25,
                      color: 'text.disabled'
                    }
                  }}
                  separator={<ChevronRight sx={{ fontSize: '0.5rem' }} />}
                >
                  {parentNodes.map((parent) => (
                    <Typography
                      key={parent.id}
                      noWrap
                      onClick={() => onNodeSelect?.(parent)}
                      sx={{ 
                        maxWidth: '100px',
                        display: 'block',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {parent.name}
                    </Typography>
                  ))}
                </Breadcrumbs>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NodeTypeIcon node={node} isExpanded onNodeUpdate={onNodeUpdate} />
                <Typography variant="h6">{node.name}</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: 'action.selected',
                '& th': { 
                  fontWeight: 500,
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: 1,
                  typography: 'caption',
                  fontSize: '0.7rem',
                  color: 'text.secondary'
                } 
              }}>
                <TableCell>{node.type === 'array' ? 'Index' : 'Key'}</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ 
              '& td': { 
                py: 0.5,
                fontSize: '0.75rem',
                color: 'text.secondary'
              }
            }}>
              {rows?.map(({ key, child }) => (
                <TableRow key={child.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NodeTypeIcon node={child} onNodeUpdate={onNodeUpdate} />
                      {node.type === 'array' ? key : (
                        <EditableText
                          value={key}
                          onChange={(newKey) => handleKeyUpdate(child, newKey)}
                          sx={{ fontSize: 'inherit' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{renderNodeValue(child)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={4000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          Duplicate key names are not allowed. A unique name was generated.
        </Alert>
      </Snackbar>
    </>
  );
}
