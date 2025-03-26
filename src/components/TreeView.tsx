import { Box, Typography, IconButton, Toolbar, Divider } from '@mui/material';
import ExpandAllIcon from '@mui/icons-material/UnfoldMore';
import CollapseAllIcon from '@mui/icons-material/UnfoldLess';
import { TreeNode } from '../types';
import { Tree } from './Tree';
import { useState } from 'react';

function getDefaultExpandedNodes(node: TreeNode): Set<string> {
  const expanded = new Set<string>();
  const visit = (node: TreeNode) => {
    if (node.children) {
      if (node.children.length > 1) {
        expanded.add(node.id);
      } else if (node.children.length === 1) {
        expanded.add(node.id);
        visit(node.children[0]);
      }
    }
  };
  visit(node);
  return expanded;
}

interface TreeViewProps {
  tree: TreeNode | null;
  source: string;
  onNodeUpdate: (node: TreeNode) => void;
}

export function TreeView({ tree, source, onNodeUpdate }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => 
    tree ? getDefaultExpandedNodes(tree) : new Set()
  );

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
        <Toolbar
          variant="dense"
          sx={{
            minHeight: 36,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            mb: 1,
            gap: 1,
            px: 1,
          }}
        >
          <IconButton onClick={handleExpandAll} size="small" title="Expand All">
            <ExpandAllIcon fontSize="small" />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton onClick={handleCollapseAll} size="small" title="Collapse All">
            <CollapseAllIcon fontSize="small" />
          </IconButton>
        </Toolbar>
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
