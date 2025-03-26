import { Box, Select, MenuItem, TextField } from '@mui/material';
import { DataFormat } from '../types';
import { formats } from '../config/formats';

interface SourceTextViewProps {
  source: string;
  format: DataFormat;
  onSourceChange: (source: string) => void;
  onFormatChange: (format: DataFormat) => void;
}

export function SourceTextView({ source, format, onSourceChange, onFormatChange }: SourceTextViewProps) {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Select
          size="small"
          value={format}
          onChange={(e) => onFormatChange(e.target.value as DataFormat)}
        >
          {Object.values(formats).map((f) => (
            <MenuItem key={f.name} value={f.name}>
              {f.name.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TextField
        multiline
        fullWidth
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        placeholder="Paste your data here..."
        sx={{ flex: 1 }}
        InputProps={{
          sx: { fontFamily: 'monospace', height: '100%' },
        }}
      />
    </>
  );
}
