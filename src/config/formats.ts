import { JsonAdapter } from '../adapters/JsonAdapter';
import { XmlAdapter } from '../adapters/XmlAdapter';
import { YamlAdapter } from '../adapters/YamlAdapter';
import { DataFormat } from '../types';

interface FormatConfig {
  name: DataFormat;
  displayName: string;
  adapter: JsonAdapter | XmlAdapter | YamlAdapter;
  detect: (text: string) => boolean;
}

export const formats: Record<DataFormat, FormatConfig> = {
  json: {
    name: 'json',
    displayName: 'JSON',
    adapter: new JsonAdapter(),
    detect: (text: string) => {
      try {
        const trimmed = text.trim();
        return trimmed.startsWith('{') || trimmed.startsWith('[');
      } catch {
        return false;
      }
    },
  },
  xml: {
    name: 'xml',
    displayName: 'XML',
    adapter: new XmlAdapter(),
    detect: (text: string) => {
      const trimmed = text.trim();
      return trimmed.startsWith('<?xml') || trimmed.startsWith('<') && trimmed.endsWith('>');
    },
  },
  yaml: {
    name: 'yaml',
    displayName: 'YAML',
    adapter: new YamlAdapter(),
    detect: (text: string) => {
      const trimmed = text.trim();
      return !trimmed.startsWith('{') && 
             !trimmed.startsWith('[') && 
             !trimmed.startsWith('<') &&
             /^[\w\s\-_]+:/.test(trimmed);
    },
  },
};

export function detectFormat(text: string): DataFormat | null {
  for (const [format, config] of Object.entries(formats)) {
    if (config.detect(text)) {
      return format as DataFormat;
    }
  }
  return null;
}
