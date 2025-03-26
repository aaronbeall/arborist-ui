import { useState, useCallback, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Tab, Tabs, Typography, TextField, Select, MenuItem, Alert, IconButton, useMediaQuery } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { DataFormat, TreeNode } from './types';
import { formats, detectFormat } from './config/formats';
import { exampleTree } from './test/testData';
import { SourceTextView } from './components/SourceTextView';
import { TreeView } from './components/TreeView';

type TabName = 'sourceText' | 'treeView';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2196f3',
          },
          background: {
            default: darkMode ? '#121212' : '#ffffff',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: darkMode ? '#121212' : '#ffffff',
                minHeight: '100vh',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  // Update dark mode when system preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const [source, setSource] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [format, setFormat] = useState<DataFormat>('json');
  const [selectedTab, setSelectedTab] = useState<TabName>('sourceText');
  const [lastParsedSource, setLastParsedSource] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateTree = useCallback(async (newSource: string, newFormat: DataFormat) => {
    try {
      setError(null);
      const adapter = formats[newFormat].adapter;
      const newTree = await adapter.parse(newSource);
      setTree(newTree);
      setLastParsedSource(newSource);
    } catch (error) {
      console.error('Error parsing source:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse source');
      setTree(null);
    }
  }, []);

  const handleSourceChange = useCallback((newSource: string) => {
    setSource(newSource);
    setError(null);
    const newFormat = detectFormat(newSource);
    if (newFormat) {
      setFormat(newFormat);
    }
  }, []);

  const handleFormatChange = useCallback(async (newFormat: DataFormat) => {
    if (!source) return;
    try {
      setError(null);
      let currentTree;
      if (source !== lastParsedSource) {
        const currentAdapter = formats[format].adapter;
        currentTree = await currentAdapter.parse(source);
      } else {
        currentTree = tree;
      }
      const newAdapter = formats[newFormat].adapter;
      const newSource = await newAdapter.stringify(currentTree || exampleTree);
      setSource(newSource);
      setFormat(newFormat);
      setTree(currentTree);
      setLastParsedSource(newSource);
    } catch (error) {
      console.error('Error converting format:', error);
      setError(error instanceof Error ? error.message : 'Failed to convert format');
    }
  }, [source, format, lastParsedSource, tree]);

  const handleTabChange = useCallback(async (_: React.SyntheticEvent, newValue: TabName) => {
    if (newValue === 'treeView' && source !== lastParsedSource) {
      await updateTree(source, format);
    }
    setSelectedTab(newValue);
  }, [source, format, lastParsedSource, updateTree]);

  const handleNodeEdit = useCallback(async (editedNode: TreeNode) => {
    if (!tree) return;
    
    const updateNode = (node: TreeNode): TreeNode => {
      if (node.id === editedNode.id) {
        return editedNode;
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode),
        };
      }
      return node;
    };

    const newTree = updateNode(tree);
    setTree(newTree);
    
    try {
      setError(null);
      const adapter = formats[format].adapter;
      const newSource = await adapter.stringify(newTree);
      setSource(newSource);
      setLastParsedSource(newSource);
    } catch (error) {
      console.error('Error updating source:', error);
      setError(error instanceof Error ? error.message : 'Failed to update source');
    }
  }, [tree, format]);

  // Initialize tree with example data
  useEffect(() => {
    const initializeExample = async () => {
      setTree(exampleTree);
      try {
        const adapter = formats[format].adapter;
        const exampleSource = await adapter.stringify(exampleTree);
        setSource(exampleSource);
        setLastParsedSource(exampleSource);
      } catch (error) {
        console.error('Error initializing example:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize example');
      }
    };
    initializeExample();
  }, []);

  // Initialize tree when source changes and we're on the tree tab
  useEffect(() => {
    if (selectedTab === 'treeView' && source && source !== lastParsedSource) {
      updateTree(source, format);
    }
  }, [selectedTab, source, format, lastParsedSource, updateTree]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          p: 3, 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default',
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Data Tree Editor
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Source" value="sourceText" />
            <Tab label="Tree" value="treeView" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {selectedTab === 'sourceText' && (
            <SourceTextView
              source={source}
              format={format}
              onSourceChange={handleSourceChange}
              onFormatChange={handleFormatChange}
            />
          )}

          {selectedTab === 'treeView' && (
            <TreeView
              tree={tree}
              source={source}
              onNodeUpdate={handleNodeEdit}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
