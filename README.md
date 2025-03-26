# Data Tree Editor

A modern web application for visualizing and editing hierarchical data structures in various formats (JSON, XML, YAML).

## Features

- Automatic format detection
- Support for JSON, XML, and YAML formats
- Interactive tree visualization
- Inline editing of node values
- Real-time synchronization between source and tree views
- Modern, responsive UI with Tailwind CSS
- Accessible components with Radix UI

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Paste your data into the source tab
2. The format will be automatically detected
3. Switch to the tree view to see the hierarchical structure
4. Click the edit button next to any value to modify it
5. Use the format dropdown to convert between different formats

## Project Structure

- `src/adapters/` - Format-specific adapters for parsing and stringifying data
- `src/types.ts` - TypeScript interfaces and types
- `src/utils/` - Utility functions
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point

## Adding New Formats

To add support for a new format:

1. Create a new adapter class in `src/adapters/` that extends `BaseAdapter`
2. Implement the `parse` and `stringify` methods
3. Add the adapter to the `adapters` object in `App.tsx`
4. Update the `DataFormat` type in `types.ts`

## License

MIT
