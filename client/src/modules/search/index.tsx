import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Alert,
  Avatar,
  TextField,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { AllProjectsAtom } from '../../shared/states/project';
import { filterPaginationData } from '../../shared/requests/filter-pagination-data';
import { searchProjectByCategory } from '../home/requests';
import { searchUserByName } from './requests';
import { UserProfile } from './typings';
import { AllProjectsData } from '../../shared/typings';

const Search = () => {
  const { query } = useParams();
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [tab, setTab] = useState(0);

  const resetState = useCallback(() => {
    setProjects(null);
    setUsers(null);
  }, [setProjects, setUsers]);

  const searchProjects = useCallback(
    async ({ page = 1, create_new_arr = false }) => {
      if (!query) return;
      const response = await searchProjectByCategory(query, page);
      if (response?.projects) {
        const formattedData = await filterPaginationData({
          state: projects,
          data: response.projects,
          page,
          countRoute: '/api/project/search-count',
          data_to_send: { tag: query },
          create_new_arr,
        });
        if (formattedData) {
          setProjects(formattedData as AllProjectsData);
        }
      }
    },
    [query, projects, setProjects]
  );

  const fetchUsers = useCallback(async () => {
    if (!query) return;
    const response = await searchUserByName(query);
    if (response?.users) {
      setUsers(response.users);
    }
  }, [query]);

  // 🔹 Fetch data on query change
  useEffect(() => {
    resetState();
    searchProjects({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query, resetState, searchProjects, fetchUsers]);

  // 🔹 Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('search-input') as HTMLInputElement;
        if (el) el.focus();
      } else if (e.key === 'Escape') {
        const el = document.getElementById('search-input') as HTMLInputElement;
        if (el) el.value = '';
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // 🔹 UI for Users
  const renderUsers = () => {
    if (!users)
      return (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      );

    if (users.length === 0)
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          No users found.
        </Alert>
      );

    return (
      <Grid container spacing={2} mt={1}>
        {users.map((user, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={user.personal_info?.profile_img} />
                    <Box>
                      <Typography fontWeight="bold">
                        {user.personal_info?.fullname || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.personal_info?.username}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  // 🔹 UI for Projects
  const renderProjects = () => {
    if (projects === null)
      return (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      );

    if (!projects.results?.length)
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          No projects published.
        </Alert>
      );

    return (
      <>
        <Grid container spacing={2} mt={1}>
          {projects.results.map((project, i) => (
            <Grid item xs={12} md={6} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {project.description?.slice(0, 100) || 'No description'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                    >
                      Author: {project.author?.personal_info?.fullname || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            onClick={() => searchProjects({ page: projects.page + 1 })}
          >
            Load More
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔍 Search bar */}
      <Box mb={4} display="flex" justifyContent="center">
        <TextField
          id="search-input"
          variant="outlined"
          placeholder='Press "Ctrl + K" to focus'
          defaultValue={query}
          sx={{ width: '60%' }}
        />
      </Box>

      {/* 🔹 Tabs Navigation */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label={`Search Results for "${query}"`} />
        <Tab label="Accounts Matched" />
      </Tabs>

      {/* 🔹 Tabs Content */}
      <Box mt={3}>
        {tab === 0 && renderProjects()}
        {tab === 1 && renderUsers()}
      </Box>
    </Box>
  );
};

export default Search;
