import { Menu, MenuItem } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { NodeValue } from '../types';

interface TypeSelectorProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onTypeSelect: (newType: NodeValue) => void;
}

export function TypeSelector({ anchorEl, onClose, onTypeSelect }: TypeSelectorProps) {
  const handleSelect = (type: NodeValue) => {
    onTypeSelect(type);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={() => handleSelect('string')}>
        <TextFieldsIcon sx={{ mr: 1 }} /> String
      </MenuItem>
      <MenuItem onClick={() => handleSelect('number')}>
        <NumbersIcon sx={{ mr: 1 }} /> Number
      </MenuItem>
      <MenuItem onClick={() => handleSelect('boolean')}>
        <CheckBoxIcon sx={{ mr: 1 }} /> Boolean
      </MenuItem>
    </Menu>
  );
}
