import { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import ProjectPostCard from '../../shared/components/molecules/project-card';
import MinimalProjectPost from './components/noBannerProject';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import LoadMoreDataBtn from '../../shared/components/molecules/load-more-data';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import { activeTabRef } from '../../shared/components/molecules/page-navigation/refs';
import LatestProjectsSkeleton from './components/latestProjectsSkeleton';
import TrendingProjectsSkeleton from './components/trendingProjectsSkeleton';
import { CategoryButton } from './components/CategoryButton';
import { categories } from './constants';
import { useHomeProjects } from './hooks/useHomeProjects';
import { loadProjectsByCategory as loadProjectsByCategoryUtil } from './utils';

const Home = () => {
  const [pageState, setPageState] = useState('home');

  const {
    projects,
    trendingProjects,
    setProjects,
    fetchLatestProjects,
    fetchProjectsByCategory,
    fetchTrendingProjects,
  } = useHomeProjects(pageState);

  const handleCategoryChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    loadProjectsByCategoryUtil(e, pageState, setPageState, setProjects);
  };

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.click();
    }

    if (pageState === 'home') {
      fetchLatestProjects({ page: 1 });
    } else {
      fetchProjectsByCategory({ page: 1 });
    }
    if (!trendingProjects) {
      fetchTrendingProjects();
    }
  }, [
    pageState,
    fetchLatestProjects,
    fetchProjectsByCategory,
    fetchTrendingProjects,
    trendingProjects,
  ]);

  return (
    <AnimationWrapper>
      <Box
        component="section"
        sx={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 0, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
        }}
      >
        {/* Latest projects */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <InPageNavigation
            routes={[pageState, 'trending projects']}
            defaultHidden={['trending projects']}
          >
            <>
              {projects?.results && projects.results.length === 0 ? (
                <LatestProjectsSkeleton count={3} />
              ) : projects?.results && projects.results.length ? (
                projects.results.map((project, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <ProjectPostCard
                        project={project}
                        author={project.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No projects published" />
              )}
              <LoadMoreDataBtn
                state={projects}
                fetchDataFun={
                  pageState === 'home'
                    ? fetchLatestProjects
                    : fetchProjectsByCategory
                }
              />
            </>
            {trendingProjects && trendingProjects.length === 0 ? (
              <TrendingProjectsSkeleton count={3} />
            ) : trendingProjects && trendingProjects.length ? (
              trendingProjects.map((project, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalProjectPost project={project} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending projects" />
            )}
          </InPageNavigation>
        </Box>

        {/* filters and trending projects */}
        <Box
          sx={{
            minWidth: { lg: '400px' },
            maxWidth: '400px',
            borderLeft: theme => `1px solid ${theme.palette.divider}`,
            pl: 4,
            pt: 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Stack spacing={5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Recommended topics
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {categories.map((category, i) => {
                  return (
                    <CategoryButton
                      key={i}
                      className={pageState === category ? 'active' : ''}
                      onClick={handleCategoryChange}
                    >
                      {category}
                    </CategoryButton>
                  );
                })}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </Typography>

              {trendingProjects === null ? (
                <TrendingProjectsSkeleton count={3} />
              ) : trendingProjects.length ? (
                trendingProjects.map((project, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalProjectPost project={project} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending projects" />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </AnimationWrapper>
  );
};

export default Home;
