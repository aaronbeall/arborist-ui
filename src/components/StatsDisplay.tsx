import { Box } from '@mui/material';
import React from 'react';
import pluralize from 'pluralize';

interface StatsDisplayProps {
  stats: Record<string, number>;
  separator?: string;
  formatValue?: (key: string, value: number) => string;
}

export function StatsDisplay({ 
  stats, 
  separator = '•', 
  formatValue = (key, value) => `${value} ${pluralize(key, value)}` 
}: StatsDisplayProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1,
      ml: 2,
      typography: 'caption',
      color: 'text.secondary',
      alignItems: 'center',
      userSelect: 'none',
    }}>
      {Object.entries(stats).map(([key, value], index) => (
        <React.Fragment key={key}>
          {index > 0 && <span>{separator}</span>}
          <span>{formatValue(key, value)}</span>
        </React.Fragment>
      ))}
    </Box>
  );
}
