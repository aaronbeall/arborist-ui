import { JsonAdapter } from '../adapters/JsonAdapter';
import { XmlAdapter } from '../adapters/XmlAdapter';
import { YamlAdapter } from '../adapters/YamlAdapter';
import { JavaScriptAdapter } from '../adapters/JavaScriptAdapter';
import { DataFormat } from '../types';

interface FormatConfig {
  name: DataFormat;
  displayName: string;
  adapter: JsonAdapter | XmlAdapter | YamlAdapter | JavaScriptAdapter;
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
             /^\s*([a-zA-Z0-9_-]+:\s*.*|\- .+|\.\.\.|---)/.test(trimmed);
    },
  },
  javascript: {
    name: 'javascript',
    displayName: 'JavaScript',
    adapter: new JavaScriptAdapter(),
    detect: (source: string) => source.trim().startsWith('[') || source.trim().startsWith('{'),
  },
};

export function detectFormat(text: string, formatsToCheck?: DataFormat[]): DataFormat | null {
  const availableFormats = formatsToCheck || Object.keys(formats) as DataFormat[];
  
  for (const format of availableFormats) {
    if (formats[format].detect(text)) {
      return format;
    }
  }
  return null;
}

export async function validateFormat(
  text: string, 
  prevFormat: DataFormat, 
  attemptedFormats: Set<DataFormat> = new Set()
): Promise<DataFormat> {
  const availableFormats = Object.keys(formats) as DataFormat[];
  const remainingFormats = availableFormats.filter(f => !attemptedFormats.has(f));
  
  if (remainingFormats.length === 0) {
    return prevFormat;
  }

  const detected = detectFormat(text, remainingFormats);
  if (!detected) {
    return prevFormat;
  }

  try {
    await formats[detected].adapter.parse(text);
    console.log(`Format detection succeeded for ${detected}`);
    return detected;
  } catch (error) {
    console.warn(`Format detection failed validation for ${detected}:`, error);
    attemptedFormats.add(detected);
    return validateFormat(text, prevFormat, attemptedFormats);
  }
}
