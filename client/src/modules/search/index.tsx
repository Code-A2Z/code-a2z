import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Keyboard as KeyboardIcon,
  Refresh as RefreshIcon,
  Add as LoadMoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loader from '../../shared/components/atoms/loader';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import ProjectPostCard from '../../shared/components/molecules/project-card';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import UserCard from '../../shared/components/molecules/user-card';
import { AllProjectsAtom } from '../../shared/states/project';
import { UserProfile } from './typings';
import { AllProjectsData } from '../../shared/typings';

// Enhanced Mock Data with more variety
const mockUsers: UserProfile[] = [
  {
    _id: '1',
    personal_info: {
      fullname: 'John Doe',
      username: 'johndoe',
      profile_img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      email: 'john@example.com',
      bio: 'Full-stack developer with 5+ years of experience'
    }
  },
  {
    _id: '2', 
    personal_info: {
      fullname: 'Jane Smith',
      username: 'janesmith',
      profile_img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      email: 'jane@example.com',
      bio: 'UI/UX Designer & Frontend Developer'
    }
  },
  {
    _id: '3',
    personal_info: {
      fullname: 'Mike Johnson',
      username: 'mikej',
      profile_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      email: 'mike@example.com',
      bio: 'Backend Developer | Node.js | Python'
    }
  },
  {
    _id: '4',
    personal_info: {
      fullname: 'Sarah Wilson',
      username: 'sarahw',
      profile_img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      email: 'sarah@example.com',
      bio: 'Mobile App Developer | React Native'
    }
  }
];

const mockProjectsData = {
  results: [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
      tags: ['react', 'nodejs', 'mongodb', 'ecommerce'],
      author: {
        personal_info: {
          fullname: 'John Doe',
          username: 'johndoe',
          profile_img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      },
      banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      activity: {
        total_likes: 24,
        total_comments: 8
      },
      publishedAt: new Date('2024-01-15').toISOString()
    },
    {
      _id: '2',
      title: 'Task Management App', 
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      tags: ['vuejs', 'firebase', 'realtime', 'productivity'],
      author: {
        personal_info: {
          fullname: 'Jane Smith',
          username: 'janesmith', 
          profile_img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      },
      banner: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
      activity: {
        total_likes: 31,
        total_comments: 12
      },
      publishedAt: new Date('2024-01-10').toISOString()
    },
    {
      _id: '3',
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard with location-based forecasts, charts, and interactive maps using modern web technologies.',
      tags: ['javascript', 'api', 'charts', 'responsive'],
      author: {
        personal_info: {
          fullname: 'Mike Johnson',
          username: 'mikej',
          profile_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        }
      },
      banner: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop',
      activity: {
        total_likes: 15,
        total_comments: 5
      },
      publishedAt: new Date('2024-01-08').toISOString()
    }
  ],
  page: 1,
  totalPages: 2
};

const Search = () => {
  const { query } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  // ✅ FIXED KEYBOARD SHORTCUTS - No Browser Conflicts
  useEffect(() => {
    console.log('🎯 Keyboard shortcuts initialized - USING MOCK DATA MODE');
    
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return;
      }

      const ctrl = event.ctrlKey || event.metaKey;
      
      // ✅ Shift + / - Help (No browser conflict)
      if (event.shiftKey && event.key === '/') {
        event.preventDefault();
        console.log('✅ Shift + / CAPTURED - Opening help dialog');
        setShowShortcuts(true);
        setLastAction('Shift + / - Help opened');
        return;
      }

      // ✅ Alternative: Ctrl + H - Help
      if (ctrl && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        console.log('✅ Ctrl + H CAPTURED - Opening help dialog');
        setShowShortcuts(true);
        setLastAction('Ctrl + H - Help opened');
        return;
      }
      
      // Escape - Close dialogs
      if (event.key === 'Escape') {
        if (showShortcuts) {
          event.preventDefault();
          setShowShortcuts(false);
          setLastAction('Esc - Dialog closed');
        }
        return;
      }
      
      // Ctrl+1 - Projects tab
      if (ctrl && event.key === '1') {
        event.preventDefault();
        setActiveTab(0);
        setLastAction('Ctrl+1 - Projects tab');
        console.log('✅ Ctrl+1 WORKED');
        return;
      }
      
      // Ctrl+2 - Users tab
      if (ctrl && event.key === '2') {
        event.preventDefault();
        setActiveTab(1);
        setLastAction('Ctrl+2 - Users tab');
        console.log('✅ Ctrl+2 WORKED');
        return;
      }
      
      // Ctrl+R - Refresh
      if (ctrl && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        handleRefresh();
        setLastAction('Ctrl+R - Refreshed data');
        console.log('✅ Ctrl+R WORKED');
        return;
      }

      // Alt+D - Debug info
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setLastAction('Alt+D - Debug mode active');
        console.log('🎯 Debug - Current state:', { 
          activeTab, 
          showShortcuts, 
          projectsCount: projects?.results.length,
          usersCount: users?.length,
          searchQuery: query 
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [showShortcuts, projects, users, query]);

  // Simulate API call with mock data
  const fetchData = async () => {
    setLoading(true);
    setApiError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter data based on search query
      const searchTerm = query?.toLowerCase() || '';
      
      const filteredUsers = mockUsers.filter(user => 
        user.personal_info.fullname.toLowerCase().includes(searchTerm) ||
        user.personal_info.username.toLowerCase().includes(searchTerm) ||
        user.personal_info.bio?.toLowerCase().includes(searchTerm)
      );
      
      const filteredProjects = {
        ...mockProjectsData,
        results: mockProjectsData.results.filter(project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      };
      
      setUsers(filteredUsers);
      setProjects(filteredProjects as AllProjectsData);
      
      setLastAction(`Search completed for "${query}" - Using mock data`);
      
    } catch (error) {
      console.error('❌ Mock data error:', error);
      setApiError('Failed to load data. Using demo data instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLastAction('Refreshing data...');
    fetchData();
  };

  // Initialize with mock data
  useEffect(() => {
    console.log('🔄 Initializing with enhanced mock data');
    fetchData();
  }, [query]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setLastAction(`Switched to ${newValue === 0 ? 'Projects' : 'Users'} tab`);
  };

  const UserCardWrapper = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <Loader />
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {users && users.length > 0 ? (
          <Grid container spacing={2}>
            {users.map((user: UserProfile, i: number) => (
              <Grid item key={user._id} xs={12} sm={6} md={12}>
                <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }}>
                  <UserCard user={user} />
                </AnimationWrapper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoDataMessage 
            message={query ? `No users found for "${query}"` : "No users found"} 
          />
        )}
      </Box>
    );
  };

  const ProjectCardWrapper = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <Loader />
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {projects && projects.results.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {projects.results.map((project, i) => (
                <Grid item key={project._id} xs={12}>
                  <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }}>
                    <ProjectPostCard
                      project={project}
                      author={project.author.personal_info}
                    />
                  </AnimationWrapper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<LoadMoreIcon />}
                onClick={() => setLastAction('Load more clicked - Feature coming soon')}
              >
                Load More Projects
              </Button>
            </Box>
          </>
        ) : (
          <NoDataMessage 
            message={query ? `No projects found for "${query}"` : "No projects published"} 
          />
        )}
      </Box>
    );
  };

  const keyboardShortcuts = [
    { keys: ['Shift', '/'], action: 'Show keyboard shortcuts' },
    { keys: ['Ctrl/Cmd', 'H'], action: 'Alternative help shortcut' },
    { keys: ['Ctrl/Cmd', '1'], action: 'Switch to Projects tab' },
    { keys: ['Ctrl/Cmd', '2'], action: 'Switch to Users tab' },
    { keys: ['Ctrl/Cmd', 'R'], action: 'Refresh results' },
    { keys: ['Alt', 'D'], action: 'Debug info' },
    { keys: ['Escape'], action: 'Close dialogs' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* CORS Warning Alert */}
      <Alert 
        severity="warning" 
        sx={{ mb: 2 }}
        icon={<WarningIcon />}
      >
        <strong>CORS Issue Detected</strong> - Using enhanced mock data. Server needs to enable CORS for live data.
      </Alert>

      {/* API Error Alert */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      {/* Success Action Alert */}
      {lastAction && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setLastAction('')}>
          {lastAction}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1 }} />
            Search Results {query && `for "${query}"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Press <strong>Shift + /</strong> for keyboard shortcuts | Using demo data
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Found: <strong>{projects?.results.length || 0} projects</strong> • <strong>{users?.length || 0} users</strong>
          </Typography>
        </Box>
        
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
            <IconButton 
              color="primary" 
              onClick={() => {
                setShowShortcuts(true);
                setLastAction('Help opened via button');
              }}
              sx={{ 
                border: 2, 
                borderColor: 'primary.main',
                bgcolor: 'background.paper'
              }}
            >
              <KeyboardIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="search results tabs">
                <Tab 
                  icon={<WorkIcon />} 
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Projects
                      <Chip 
                        label={projects?.results.length || 0} 
                        size="small" 
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                      />
                    </Box>
                  } 
                />
                <Tab 
                  icon={<PersonIcon />} 
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Users
                      <Chip 
                        label={users?.length || 0} 
                        size="small" 
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                      />
                    </Box>
                  } 
                />
              </Tabs>
            </Box>

            {activeTab === 0 && <ProjectCardWrapper />}
            {activeTab === 1 && <UserCardWrapper />}
          </Paper>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Users related to search
                <Chip 
                  label={users?.length || 0} 
                  size="small" 
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                />
              </Typography>
              <UserCardWrapper />
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog 
        open={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <KeyboardIcon sx={{ mr: 1 }} />
          Keyboard Shortcuts
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            {keyboardShortcuts.map((shortcut, index) => (
              <ListItem key={index} divider={index < keyboardShortcuts.length - 1}>
                <ListItemIcon>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {shortcut.keys.map((key, keyIndex) => (
                      <Chip 
                        key={keyIndex} 
                        label={key} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24,
                          bgcolor: key === 'Ctrl/Cmd' ? 'primary.light' : 'transparent',
                          color: key === 'Ctrl/Cmd' ? 'white' : 'inherit'
                        }}
                      />
                    ))}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={shortcut.action} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowShortcuts(false)}
            variant="contained"
          >
            Close (Esc)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Snackbar */}
      <Snackbar
        open={loading}
        message="Loading data..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Container>
  );
};

export default Search;