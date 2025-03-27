import { Handle, Position } from 'reactflow';
import { Box, Typography, Table, TableBody, TableRow, TableCell, Popper, Paper } from '@mui/material';
import { TextSnippet, DataObject, ViewList, Code } from '@mui/icons-material';
import { useState } from 'react';
import { NodeType } from '../types';

interface NodeData {
  label: string;
  properties?: Record<string, any>;
  elements?: Record<string, any>;
  type?: NodeType;
}

const typeIcons = {
  object: DataObject,
  array: ViewList,
  property: TextSnippet,
  value: Code,
};

export function GraphNode({ data }: { data: NodeData }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const showPopper = Boolean(anchorEl) && hovering;

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const Icon = data.type ? typeIcons[data.type as keyof typeof typeIcons] : undefined;

  return (
    <>
      <Box
        sx={{
          padding: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          minWidth: 120,
          maxWidth: 150,
          cursor: 'pointer',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Handle type="target" position={Position.Top} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon && <Icon sx={{ fontSize: 16, opacity: 0.5 }} />}
          <Typography variant="subtitle2" noWrap>{data.label}</Typography>
        </Box>
        {data.type === 'object' && data.properties && (
          <Typography variant="caption" color="text.secondary">
            {Object.keys(data.properties).length} properties
          </Typography>
        )}
        {data.type === 'array' && data.elements && (
          <Typography variant="caption" color="text.secondary">
            {Object.keys(data.elements).length} elements
          </Typography>
        )}
        <Handle type="source" position={Position.Bottom} />
      </Box>

      <Popper 
        open={showPopper} 
        anchorEl={anchorEl}
        placement="right"
        sx={{ zIndex: 1000 }}
      >
        <Paper 
          sx={{ 
            p: 2, 
            minWidth: 200, 
            maxWidth: 300,
            boxShadow: 3,
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={handleMouseLeave}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{data.label}</Typography>
          {data.type === 'object' && data.properties && Object.keys(data.properties).length > 0 && (
            <Table size="small">
              <TableBody>
                {Object.entries(data.properties).map(([key, value]) => (
                  <TableRow key={key} sx={{ '& td': { border: 0, py: 0 } }}>
                    <TableCell sx={{ pl: 0 }}>{key}:</TableCell>
                    <TableCell sx={{ pr: 0 }}>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data.type === 'array' && data.elements && Object.keys(data.elements).length > 0 && (
            <Table size="small">
              <TableBody>
                {Object.entries(data.elements).map(([key, value]) => (
                  <TableRow key={key} sx={{ '& td': { border: 0, py: 0 } }}>
                    <TableCell sx={{ pl: 0 }}>{key}:</TableCell>
                    <TableCell sx={{ pr: 0 }}>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Popper>
    </>
  );
}
