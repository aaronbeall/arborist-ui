import { DataFormat } from '../types';

export function detectFormat(text: string): DataFormat {
  const trimmed = text.trim();
  
  // Try to parse as JSON
  try {
    JSON.parse(trimmed);
    return 'json';
  } catch {}

  // Check for XML
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
    return 'xml';
  }

  // Check for YAML
  if (trimmed.startsWith('---') || /^[a-zA-Z0-9_]+:\s/.test(trimmed)) {
    return 'yaml';
  }

  // Default to JSON if no other format is detected
  return 'json';
} 