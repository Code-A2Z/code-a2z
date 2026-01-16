import { Box, Stack, CircularProgress, useTheme } from '@mui/material';
import { useEffect } from 'react';
import A2ZTypography from '../../../../../shared/components/atoms/typography';
import PeopleIcon from '@mui/icons-material/People';
import InPageNavigation from '../../../../../shared/components/molecules/page-navigation';
import { Virtuoso } from 'react-virtuoso';
import { useAtomValue } from 'jotai';
import { HomePageProjectsAtom } from '../../../v1/states';
import BannerProjectCard from '../../../v1/components/banner-project-card';
import NoDataMessageBox from '../../../../../shared/components/atoms/no-data-msg';
import { BannerSkeleton } from '../../../../../shared/components/atoms/skeleton';
import useSearchV1 from './hooks';
import UserCard from './components/user-card';

const SearchModule = () => {
  const theme = useTheme();
  const projects = useAtomValue(HomePageProjectsAtom);

  const {
    users,
    isLoadingProjects,
    isLoadingUsers,
    fetchUsers,
    fetchProjects,
    searchTerm,
  } = useSearchV1();

  useEffect(() => {
    if (searchTerm) {
      fetchProjects(searchTerm, 1);
      fetchUsers(searchTerm, 1);
    }
  }, [searchTerm, fetchProjects, fetchUsers]);

  if (!searchTerm) {
    return null;
  }

  return (
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
          routes={[`Search Results from "${searchTerm}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
        >
          {isLoadingProjects && projects.length === 0 ? (
            <BannerSkeleton count={3} />
          ) : projects.length > 0 ? (
            <Virtuoso
              style={{
                height: '100%',
                width: '100%',
                scrollbarWidth: 'none',
              }}
              totalCount={projects.length}
              itemContent={index => (
                <BannerProjectCard key={index} project={projects[index]} />
              )}
              overscan={200}
              endReached={() => {
                const nextPage = Math.floor(projects.length / 10) + 1;
                fetchProjects(searchTerm, nextPage);
              }}
              components={{
                Footer: () =>
                  isLoadingProjects ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : null,
              }}
            />
          ) : (
            <NoDataMessageBox message="No projects found" />
          )}

          {isLoadingUsers && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : users.length > 0 ? (
            <Virtuoso
              style={{
                height: '100%',
                width: '100%',
                scrollbarWidth: 'none',
              }}
              totalCount={users.length}
              itemContent={index => (
                <UserCard
                  key={index}
                  personal_info={users[index].personal_info}
                />
              )}
              overscan={200}
              endReached={() => {
                const nextPage = Math.floor(users.length / 10) + 1;
                fetchUsers(searchTerm, nextPage);
              }}
              components={{
                Footer: () =>
                  isLoadingUsers ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : null,
              }}
            />
          ) : (
            <NoDataMessageBox message="No users found" />
          )}
        </InPageNavigation>
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box
        sx={{
          minWidth: { lg: 400 },
          maxWidth: 400,
          borderLeft: `1px solid ${theme.palette.divider}`,
          pl: 4,
          pt: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <A2ZTypography variant="h6" text="Users related to search" />
          <PeopleIcon fontSize="medium" color="action" />
        </Stack>

        {isLoadingUsers && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : users.length > 0 ? (
          <Virtuoso
            style={{
              height: '100%',
              width: '100%',
              scrollbarWidth: 'none',
            }}
            totalCount={users.length}
            itemContent={index => (
              <UserCard
                key={index}
                personal_info={users[index].personal_info}
              />
            )}
            overscan={200}
            endReached={() => {
              const nextPage = Math.floor(users.length / 10) + 1;
              fetchUsers(searchTerm, nextPage);
            }}
            components={{
              Footer: () =>
                isLoadingUsers ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : null,
            }}
          />
        ) : (
          <NoDataMessageBox message="No users found" />
        )}
      </Box>
    </Box>
  );
};

export default SearchModule;
