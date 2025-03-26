import { Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { FormatAlignLeft, Clear } from '@mui/icons-material';
import { DataFormat } from '../types';
import { formats } from '../config/formats';

interface SourceTextViewProps {
  source: string;
  format: DataFormat;
  onSourceChange: (source: string) => void;
  onFormatChange: (format: DataFormat) => void;
  onFormat: () => void;
}

export function SourceTextView({ source, format, onSourceChange, onFormatChange, onFormat }: SourceTextViewProps) {
  const handleClear = () => {
    onSourceChange('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={format}
            label="Format"
            onChange={(e) => onFormatChange(e.target.value as DataFormat)}
          >
            {Object.entries(formats).map(([key, { displayName }]) => (
              <MenuItem key={key} value={key}>{displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Reformat">
          <IconButton onClick={onFormat} size="small">
            <FormatAlignLeft />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear">
          <IconButton onClick={handleClear} size="small">
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TextField
        multiline
        fullWidth
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        sx={{
          flex: 1,
          '& .MuiInputBase-root': {
            height: '100%',
          },
          '& .MuiInputBase-input': {
            height: '100% !important',
            overflow: 'auto !important',
          },
        }}
      />
    </Box>
  );
}
