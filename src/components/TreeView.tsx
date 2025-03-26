import { Box, Typography, IconButton, Stack } from '@mui/material';
import ExpandAllIcon from '@mui/icons-material/UnfoldMore';
import CollapseAllIcon from '@mui/icons-material/UnfoldLess';
import { TreeNode } from '../types';
import { Tree } from './Tree';
import { useState } from 'react';

interface TreeViewProps {
  tree: TreeNode | null;
  source: string;
  onNodeUpdate: (node: TreeNode) => void;
}

export function TreeView({ tree, source, onNodeUpdate }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleExpandAll = () => {
    if (!tree) return;
    const allIds = new Set<string>();
    const collectIds = (node: TreeNode) => {
      allIds.add(node.id);
      node.children?.forEach(collectIds);
    };
    collectIds(tree);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <>
      {tree && (
        <Stack direction="row" spacing={1} mb={1}>
          <IconButton onClick={handleExpandAll} size="small" title="Expand All">
            <ExpandAllIcon />
          </IconButton>
          <IconButton onClick={handleCollapseAll} size="small" title="Collapse All">
            <CollapseAllIcon />
          </IconButton>
        </Stack>
      )}
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
          <Tree 
            node={tree} 
            onNodeUpdate={onNodeUpdate} 
            expandedNodes={expandedNodes}
            onExpandedNodesChange={setExpandedNodes}
          />
        ) : (
          <Typography color="text.secondary">
            {source ? 'Invalid data format. Please check the source tab for errors.' : 'No data to display. Please enter data in the source tab.'}
          </Typography>
        )}
      </Box>
    </>
  );
}
