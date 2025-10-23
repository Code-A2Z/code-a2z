// client/src/modules/search/Search.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Chip,
  Paper,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Keyboard as KeyboardIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { AllProjectsAtom } from '../../shared/states/project';
import { ProjectPostCard } from '../../shared/components/molecules/project-card';
import Loader from '../../shared/components/atoms/loader';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import UserCard from '../../shared/components/molecules/user-card';
import { fetchProjects, fetchUsers } from './api';
import { initKeyboardShortcuts } from './utils';

const Search = () => {
  const { query } = useParams();
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [apiError, setApiError] = useState('');
  const theme = useTheme();

  const handleRefresh = () => loadData();

  const loadData = async () => {
    setLoading(true);
    setApiError('');
    try {
      const [projectData, userData] = await Promise.all([
        fetchProjects(query),
        fetchUsers(query),
      ]);
      setProjects(projectData);
      setUsers(userData);
      setLastAction(`Search completed for "${query}"`);
    } catch (error) {
      console.error(error);
      setApiError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cleanup = initKeyboardShortcuts({
      setActiveTab,
      setShowShortcuts,
      setLastAction,
      handleRefresh,
    });
    loadData();
    return cleanup;
  }, [query]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
        <strong>CORS Issue Detected</strong> - Using demo data.
      </Alert>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      {lastAction && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {lastAction}
        </Alert>
      )}

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">
          Search Results {query && `for "${query}"`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data (Ctrl+R)">
            <IconButton
              color="primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Keyboard Shortcuts (Shift + /)">
            <IconButton color="primary" onClick={() => setShowShortcuts(true)}>
              <KeyboardIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab
            icon={<WorkIcon />}
            label={
              <Box>
                Projects
                <Chip label={projects?.results.length || 0} size="small" />
              </Box>
            }
          />
          <Tab
            icon={<PersonIcon />}
            label={
              <Box>
                Users
                <Chip label={users?.length || 0} size="small" />
              </Box>
            }
          />
        </Tabs>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {loading ? (
              <Loader />
            ) : (
              projects.results.map((p, i) => (
                <Grid item key={p._id} xs={12}>
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <ProjectPostCard
                      project={p}
                      author={p.author.personal_info}
                    />
                  </AnimationWrapper>
                </Grid>
              ))
            )}
          </Grid>
        )}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            {loading ? (
              <Loader />
            ) : (
              users.map((u, i) => (
                <Grid item key={u._id} xs={12} sm={6}>
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.08 }}
                  >
                    <UserCard user={u} />
                  </AnimationWrapper>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>

      <Snackbar
        open={loading}
        message="Loading data..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      {/* Shortcuts Dialog */}
      <Dialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>Shift + / → Show shortcuts</ListItem>
            <ListItem>Ctrl/Cmd + H → Show shortcuts</ListItem>
            <ListItem>Ctrl/Cmd + 1 → Projects tab</ListItem>
            <ListItem>Ctrl/Cmd + 2 → Users tab</ListItem>
            <ListItem>Ctrl/Cmd + R → Refresh</ListItem>
            <ListItem>Alt + D → Debug info</ListItem>
            <ListItem>Esc → Close dialog</ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShortcuts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Search;
