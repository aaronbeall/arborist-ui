import { useState, useCallback, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Tab, Tabs, Typography, Alert, IconButton, useMediaQuery, Paper, Divider } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { DataFormat, TreeNode } from './types';
import { formats, validateFormat } from './config/formats';
import { exampleTree } from './test/testData';
import { SourceTextView } from './components/SourceTextView';
import { TreeView } from './components/TreeView';
import logo from './assets/logo.svg';

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

  const handleSourceChange = useCallback(async (newSource: string) => {
    setSource(newSource);
    setError(null);
    const newFormat = await validateFormat(newSource, format);
    if (newFormat !== format) {
      setFormat(newFormat);
    }
  }, [format]);

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

  const handleFormat = useCallback(async () => {
    if (!source) return;
    try {
      setError(null);
      const adapter = formats[format].adapter;
      const parsed = await adapter.parse(source);
      const formatted = await adapter.stringify(parsed);
      setSource(formatted);
      setLastParsedSource(formatted);
      setTree(parsed);
    } catch (error) {
      console.error('Error formatting:', error);
      setError(error instanceof Error ? error.message : 'Failed to format');
    }
  }, [source, format]);

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
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderRadius: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" component="h1" color="primary.main">
                    arborist <b>ui</b>
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="subtitle1" component="h2" color="secondary">
                    Tree Data Editor, Formatter & Convertor
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Source" value="sourceText" />
            <Tab label="Tree" value="treeView" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, overflow: 'auto' }}>
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
              onFormat={handleFormat}
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
