import { Box, Typography, IconButton, Toolbar, Divider } from '@mui/material';
import ExpandAllIcon from '@mui/icons-material/UnfoldMore';
import CollapseAllIcon from '@mui/icons-material/UnfoldLess';
import { SearchField } from './SearchField';
import { TreeNode } from '../types';
import { Tree } from './Tree';
import { useState, useMemo, useEffect } from 'react';
import { StatsDisplay } from './StatsDisplay';

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

function findMatchingNodes(node: TreeNode, filter: string): Set<string> {
  const matches = new Set<string>();
  const filterLower = filter.toLowerCase();

  const visit = (node: TreeNode) => {
    const nameMatch = node.name.toLowerCase().includes(filterLower);
    const valueMatch = node.value !== undefined && String(node.value).toLowerCase().includes(filterLower);
    
    if (nameMatch || valueMatch) {
      matches.add(node.id);
    }
    node.children?.forEach(visit);
  };

  visit(node);
  return matches;
}

function buildParentMap(node: TreeNode): Map<string, TreeNode> {
  const parentMap = new Map<string, TreeNode>();
  
  const visit = (node: TreeNode, parent?: TreeNode) => {
    if (parent) {
      parentMap.set(node.id, parent);
    }
    node.children?.forEach(child => visit(child, node));
  };
  
  visit(node);
  return parentMap;
}

function collectAncestors(node: TreeNode, targetIds: Set<string>): Set<string> {
  const ancestors = new Set<string>();
  const parentMap = buildParentMap(node);

  targetIds.forEach(id => {
    let current = parentMap.get(id);
    while (current) {
      ancestors.add(current.id);
      current = parentMap.get(current.id);
    }
  });

  return ancestors;
}

function collectDescendants(node: TreeNode, targetIds: Set<string>): Set<string> {
  const descendants = new Set<string>();

  const visit = (node: TreeNode, isDescendant: boolean) => {
    if (isDescendant || targetIds.has(node.id)) {
      descendants.add(node.id);
      node.children?.forEach(child => visit(child, true));
    } else {
      node.children?.forEach(child => visit(child, false));
    }
  };

  visit(node, false);
  return descendants;
}

interface NodeStats {
  total: number;
  objects: number;
  arrays: number;
  properties: number;
}

function collectStats(node: TreeNode): NodeStats {
  const stats: NodeStats = { total: 0, objects: 0, arrays: 0, properties: 0 };
  
  const visit = (node: TreeNode) => {
    stats.total++;
    if (node.type === 'object') stats.objects++;
    else if (node.type === 'array') stats.arrays++;
    else stats.properties++;
    node.children?.forEach(visit);
  };
  
  visit(node);
  return stats;
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
  const [filter, setFilter] = useState('');
  const filteredNodes = useMemo(() => {
    if (!tree || !filter) return null;

    const matches = findMatchingNodes(tree, filter);
    const ancestors = collectAncestors(tree, matches);
    const visible = new Set([
      ...matches,
      ...ancestors,
      ...collectDescendants(tree, matches)
    ]);

    return {
      matches,
      visible,
      expandedParents: ancestors
    };
  }, [tree, filter]);

  // Update expanded nodes when filter changes
  useEffect(() => {
    if (filteredNodes?.expandedParents) {
      setExpandedNodes(prev => new Set([...prev, ...filteredNodes.expandedParents]));
    }
  }, [filteredNodes]);

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

  const stats = useMemo(() => tree ? collectStats(tree) : null, [tree]);

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
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            <IconButton onClick={handleExpandAll} size="small" title="Expand All">
              <ExpandAllIcon fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton onClick={handleCollapseAll} size="small" title="Collapse All">
              <CollapseAllIcon fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <SearchField 
              value={filter}
              onChange={setFilter}
            />
            {filteredNodes && (
              <StatsDisplay 
                stats={{
                  match: filteredNodes.matches.size,
                  //visible: filteredNodes.visible.size,
                  'hidden node': stats?.total ? stats.total - filteredNodes.visible.size : 0
                }}
              />
            )}
          </Box>
          {stats && (
            <StatsDisplay 
              stats={{
                node: stats.total,
                object: stats.objects,
                array: stats.arrays,
                property: stats.properties
              }}
            />
          )}
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
            matchedNodes={filteredNodes?.matches}
            visibleNodes={filteredNodes?.visible}
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
