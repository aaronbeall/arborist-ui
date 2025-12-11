import { useState, useCallback, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Tab, Tabs, Typography, Alert, IconButton, useMediaQuery, Paper, Divider, Chip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Brightness4, Brightness7, MoreVert, Email } from '@mui/icons-material';
import { DataFormat, TreeNode } from './types';
import { formats, validateFormat } from './config/formats';
import { exampleTree } from './test/testData';
import { SourceTextView } from './components/SourceTextView';
import { TreeView } from './components/TreeView';
import { GraphView } from './components/GraphView';
import logo from './assets/logo.svg';
import BuyMeACoffeeIcon from './assets/buymeacoffee.svg?react';
import PatreonIcon from './assets/patreon.svg?react';

type TabName = 'sourceText' | 'treeView' | 'graph';

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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

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

  const handleMinify = useCallback(async () => {
    try {
      setError(null);
      const adapter = formats[format].adapter;
      const minified = await adapter.minify(source);
      setSource(minified);
    } catch (error) {
      console.error('Minification failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to minify');
    }
  }, [format, source]);

  const handleTabChange = useCallback(async (_: React.SyntheticEvent, newValue: TabName) => {
    if ((newValue === 'treeView' || newValue === 'graph') && source !== lastParsedSource) {
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

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget);
  const closeMenu = () => setMenuAnchorEl(null);

  const openAbout = () => { setAboutOpen(true); closeMenu(); };
  const closeAbout = () => setAboutOpen(false);

  const openContact = () => {
    window.location.href = 'mailto:support@metamodernmonkey.com?subject=Arborist%20UI';
    closeMenu();
  };

  const openPatreon = () => {
    window.open('https://www.patreon.com/metamodernmonkey', '_blank', 'noopener,noreferrer');
    closeMenu();
  };

  const openCoffee = () => {
    window.open('https://www.buymeacoffee.com/metamodernmonkey', '_blank', 'noopener,noreferrer');
    closeMenu();
  };

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
                  <Typography variant="subtitle2" component="h2" color="secondary">
                    <code>JSON, YAML, XML, more...</code> <code>Viewer, Editor, Formatter, Convertor</code>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <IconButton onClick={openMenu} color="inherit" aria-label="App menu">
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={openAbout}>About</MenuItem>
                  <MenuItem onClick={openContact}>Contact</MenuItem>
                  <MenuItem onClick={openPatreon}>Support on Patreon</MenuItem>
                  <MenuItem onClick={openCoffee}>Buy Me a Coffee</MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Source" value="sourceText" />
            <Tab label="Tree" value="treeView" />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Graph
                  <Chip
                    label="Beta"
                    size="small"
                    color="primary"
                    sx={{ height: 20 }}
                  />
                </Box>
              }
              value="graph"
            />
          </Tabs>
        </Box>

        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          overflow: 'auto',
          height: selectedTab === 'graph' ? 'calc(100vh - 180px)' : 'auto'
        }}>
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
              onMinify={handleMinify}
            />
          )}

          {selectedTab === 'treeView' && (
            <TreeView
              tree={tree}
              source={source}
              onNodeUpdate={handleNodeEdit}
            />
          )}

          {selectedTab === 'graph' && (
            <GraphView tree={tree} />
          )}
        </Box>

        <Dialog open={aboutOpen} onClose={closeAbout} aria-labelledby="about-dialog-title">
          <DialogTitle id="about-dialog-title">About Arborist UI</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Built with ❤️ and 🍌 by <Link href="https://metamodernmonkey.com" target="_blank" rel="noopener noreferrer">Meta Modern Monkey</Link>.
            </Typography>

            <List dense sx={{ mt: 1 }}>
              <ListItemButton onClick={openContact}>
                <ListItemIcon><Email /></ListItemIcon>
                <ListItemText
                  primary="Contact"
                  secondary="support@metamodernmonkey.com"
                />
              </ListItemButton>
              <ListItemButton onClick={openPatreon} component="a" href="https://www.patreon.com/metamodernmonkey" target="_blank" rel="noopener noreferrer">
                <ListItemIcon>
                  <PatreonIcon style={{ width: 20, height: 20, color: darkMode ? '#fff' : '#757575' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Support on Patreon"
                  secondary="patreon.com/metamodernmonkey"
                />
              </ListItemButton>
              <ListItemButton onClick={openCoffee} component="a" href="https://www.buymeacoffee.com/metamodernmonkey" target="_blank" rel="noopener noreferrer">
                <ListItemIcon>
                  <BuyMeACoffeeIcon style={{ width: 20, height: 20, color: darkMode ? '#fff' : '#757575' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Buy Me a Coffee"
                  secondary="buymeacoffee.com/metamodernmonkey"
                />
              </ListItemButton>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAbout}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
