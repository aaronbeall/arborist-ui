import { Box, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, useTheme } from '@mui/material';
import { FormatAlignLeft, Clear, Compress } from '@mui/icons-material';
import { DataFormat } from '../types';
import { formats } from '../config/formats';
import Editor from "@monaco-editor/react";

interface SourceTextViewProps {
  source: string;
  format: DataFormat;
  onSourceChange: (source: string) => void;
  onFormatChange: (format: DataFormat) => void;
  onFormat: () => void;
  onMinify: () => void;
}

export function SourceTextView({ source, format, onSourceChange, onFormatChange, onFormat, onMinify }: SourceTextViewProps) {
  const theme = useTheme();

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
        <Tooltip title="Minify">
          <IconButton onClick={onMinify} size="small">
            <Compress />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear">
          <IconButton onClick={handleClear} size="small">
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ flex: 1, border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 1, overflow: 'hidden' }}>
        <Editor
          value={source}
          onChange={(value) => onSourceChange(value ?? '')}
          language={format.toLowerCase()}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'off',
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            wordWrap: 'on'
          }}
        />
      </Box>
    </Box>
  );
}
