import { Box } from '@mui/material';
import { EditableText } from './EditableText';
import { TreeNode } from '../types';

interface EditableNodeValueProps {
  node: TreeNode;
  onEdit: (node: TreeNode) => void;
}

export function EditableNodeValue({ node, onEdit }: EditableNodeValueProps) {
  const handleChange = (editValue: string) => {
    let newValue: string | number | boolean = editValue;

    // Try to preserve the original type
    if (typeof node.value === 'number') {
      const num = Number(editValue);
      if (!isNaN(num) && String(num) === editValue) {
        newValue = num;
      }
    } else if (typeof node.value === 'boolean') {
      const lower = editValue.toLowerCase();
      if (lower === 'true') newValue = true;
      else if (lower === 'false') newValue = false;
    }

    onEdit({ ...node, value: newValue });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
      <Box component="span">:</Box>
      <EditableText
        value={String(node.value || '')}
        onChange={handleChange}
        variant="body2"
        sx={{ display: 'inline-flex', color: 'inherit' }}
      />
    </Box>
  );
}