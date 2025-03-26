import { Box, Typography } from '@mui/material';
import { TreeNode } from '../types';
import { Tree } from './Tree';

interface TreeViewProps {
  tree: TreeNode | null;
  source: string;
  onNodeUpdate: (node: TreeNode) => void;
}

export function TreeView({ tree, source, onNodeUpdate }: TreeViewProps) {
  return (
    <Box sx={{ 
      flex: 1, 
      overflow: 'auto', 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 1, 
      p: 2,
      bgcolor: 'background.paper',
    }}>
      {tree ? (
        <Tree node={tree} onNodeUpdate={onNodeUpdate} />
      ) : (
        <Typography color="text.secondary">
          {source ? 'Invalid data format. Please check the source tab for errors.' : 'No data to display. Please enter data in the source tab.'}
        </Typography>
      )}
    </Box>
  );
}
