import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: <SearchIcon fontSize="small" sx={{ ml: 0.5, mr: 0.5, color: 'action.active' }} />,
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={() => onChange('')}
                sx={{ mr: -0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
      sx={{
        ml: 1,
        width: 160,
        transition: 'width 0.2s',
        '&:focus-within': {
          width: 240,
        },
        '& .MuiOutlinedInput-root': {
          height: 28,
          fontSize: '0.875rem',
        }
      }}
    />
  );
}
