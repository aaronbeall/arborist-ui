import { Box, Typography, IconButton, Toolbar, Divider, Stack } from '@mui/material';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ExpandAllIcon from '@mui/icons-material/UnfoldMore';
import CollapseAllIcon from '@mui/icons-material/UnfoldLess';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { SearchField } from './SearchField';
import { TreeNode } from '../types';
import { Tree } from './Tree';
import { useState, useMemo, useEffect } from 'react';
import { StatsDisplay } from './StatsDisplay';
import { EditPanel } from './EditPanel';
import { findNodeById, findParentPath, getFilteredNodes, collectAllIds } from '../utils/treeUtils';

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
  const [editNodeId, setEditNodeId] = useState<string | null>(null);
  const [nodeParentPath, setNodeParentPath] = useState<TreeNode[]>([]);

  const editNode = useMemo(() => {
    if (!tree || !editNodeId) return null;
    return findNodeById(tree, editNodeId);
  }, [tree, editNodeId]);

  const filteredNodes = useMemo(() => {
    if (!tree || !filter) return null;
    return getFilteredNodes(tree, filter);
  }, [tree, filter]);

  // Update expanded nodes when filter changes
  useEffect(() => {
    if (filteredNodes?.expandedParents) {
      setExpandedNodes(prev => new Set([...prev, ...filteredNodes.expandedParents]));
    }
  }, [filteredNodes]);

  const handleExpandAll = () => {
    if (!tree) return;
    setExpandedNodes(collectAllIds(tree));
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleNodeSelect = (node: TreeNode) => {
    if (tree) {
      setNodeParentPath(findParentPath(tree, node));
    }
    setEditNodeId(node.id);
  };

  const handleCloseEditPanel = () => {
    setEditNodeId(null);
    setNodeParentPath([]);
  };

  const stats = useMemo(() => tree ? collectStats(tree) : null, [tree]);

  return (
    <PanelGroup direction="horizontal" style={{ overflow: 'visible' }}>
      <Panel defaultSize={75} minSize={30} style={{ overflow: 'visible' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
        }}>
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
                onEditNode={handleNodeSelect}
                editingNodeId={editNodeId}
              />
            ) : (
              <Typography color="text.secondary">
                {source ? 'Invalid data format. Please check the source tab for errors.' : 'No data to display. Please enter data in the source tab.'}
              </Typography>
            )}
          </Box>
        </Box>
      </Panel>
      
      {editNode && (
        <>
          <PanelResizeHandle>
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.3,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1
              }
            }}>
              <DragIndicatorIcon 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '20px'
                }} 
              />
            </Box>
          </PanelResizeHandle>
          <Panel defaultSize={25} minSize={20} style={{ overflow: 'visible' }}>
              <EditPanel 
                node={editNode}
                onClose={handleCloseEditPanel}
                onNodeSelect={handleNodeSelect}
                parentNodes={nodeParentPath}
                onNodeUpdate={onNodeUpdate}
              />
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}
