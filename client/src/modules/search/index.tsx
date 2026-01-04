import { Navigate, useParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import BannerProjectCard from '../home/v1/components/banner-project-card';
import { HomePageProjectsAtom } from '../home/v1/states';
import { Virtuoso } from 'react-virtuoso';
import { BannerSkeleton } from '../../shared/components/atoms/skeleton';
import NoDataMessageBox from '../../shared/components/atoms/no-data-msg';
import useHome from '../home/v1/hooks';
import { SearchPageUsersAtom } from './states';
import UserCard from './components/user-card';
import { Box, CircularProgress, Stack } from '@mui/material';
import useSearch from './hooks';
import A2ZTypography from '../../shared/components/atoms/typography';
import PeopleIcon from '@mui/icons-material/People';

const Search = () => {
  const { query } = useParams();
  const projects = useAtomValue(HomePageProjectsAtom);
  const { fetchProjectsByCategory } = useHome();

  const users = useAtomValue(SearchPageUsersAtom);
  const { fetchUsers } = useSearch();

  useEffect(() => {
    fetchProjectsByCategory({ query: query || '' });
    fetchUsers(query || '');
  }, [query, fetchProjectsByCategory, fetchUsers]);

  return !query || query.trim() === '' ? (
    <Navigate to="/" />
  ) : (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 150px)',
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 0, md: 5 },
        p: 3,
      }}
    >
      {/* LEFT MAIN CONTENT */}
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <InPageNavigation
          routes={[`Search Results from "${query}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
        >
          {projects.length ? (
            <Virtuoso
              style={{ height: '100%', width: '100%', scrollbarWidth: 'none' }}
              totalCount={projects.length}
              itemContent={index => (
                <BannerProjectCard key={index} project={projects[index]} />
              )}
              overscan={200}
              endReached={() => {
                const nextPage = Math.floor(projects.length / 10) + 1; // Assuming page size of 10
                fetchProjectsByCategory({ query: query || '', page: nextPage });
              }}
              components={{
                Footer: () =>
                  !projects || projects.length === 0 ? (
                    <BannerSkeleton count={3} />
                  ) : null, // FIX ME
              }}
            />
          ) : (
            <NoDataMessageBox message="No projects available" />
          )}

          {users.length ? (
            <Virtuoso
              style={{ height: '100%', width: '100%', scrollbarWidth: 'none' }}
              totalCount={users.length}
              itemContent={index => (
                <UserCard
                  key={index}
                  personal_info={users[index].personal_info}
                />
              )}
              overscan={200}
              endReached={() => {
                const nextPage = Math.floor(users.length / 10) + 1; // Assuming page size of 10
                fetchUsers(query || '', nextPage);
              }}
              components={{
                Footer: () =>
                  !projects || projects.length === 0 ? (
                    <CircularProgress size={24} />
                  ) : null, // FIX ME
              }}
            />
          ) : (
            <NoDataMessageBox message="No user found" />
          )}
        </InPageNavigation>
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box
        sx={{
          minWidth: { lg: 400 },
          maxWidth: 400,
          borderLeft: theme => `1px solid ${theme.palette.divider}`,
          pl: 4,
          pt: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <A2ZTypography variant="h6" text="Users related to search" />
          <PeopleIcon fontSize="medium" color="action" />
        </Stack>

        {users.length ? (
          <Virtuoso
            style={{ height: '100%', width: '100%', scrollbarWidth: 'none' }}
            totalCount={users.length}
            itemContent={index => (
              <UserCard
                key={index}
                personal_info={users[index].personal_info}
              />
            )}
            overscan={200}
            endReached={() => {
              const nextPage = Math.floor(users.length / 10) + 1; // Assuming page size of 10
              fetchUsers(query || '', nextPage);
            }}
            components={{
              Footer: () =>
                !projects || projects.length === 0 ? (
                  <CircularProgress size={24} />
                ) : null, // FIX ME
            }}
          />
        ) : (
          <NoDataMessageBox message="No user found" />
        )}
      </Box>
    </Box>
  );
};

export default Search;
