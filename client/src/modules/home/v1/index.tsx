import { Box, Stack } from '@mui/material';
import { Routes } from 'react-router-dom';
import A2ZTypography from '../../../shared/components/atoms/typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { categories } from './constants';
import { CategoryButton } from './components/category-button';
import InPageNavigation from '../../../shared/components/molecules/page-navigation';
import NoBannerProjectCard from './components/no-banner-project';
import { useAtomValue } from 'jotai';
import { HomePageProjectsAtom } from './states';
import BannerProjectCard from './components/banner-project-card';
import NoDataMessageBox from '../../../shared/components/atoms/no-data-msg';
import {
  BannerSkeleton,
  NoBannerSkeleton,
} from '../../../shared/components/atoms/skeleton';
import { useEffect } from 'react';
import useHomeV1 from './hooks';
import { Virtuoso } from 'react-virtuoso';

const Home = () => {
  const projects = useAtomValue(HomePageProjectsAtom);

  const {
    routes,
    isHomePage,
    selectedCategory,
    setSelectedCategory,
    trendingProjects,
    fetchLatestProjects,
    fetchTrendingProjects,
    fetchProjectsByCategory,
  } = useHomeV1();

  useEffect(() => {
    // Only fetch projects if not on project page
    if (isHomePage) {
      if (!selectedCategory) {
        fetchLatestProjects();
      } else if (selectedCategory !== 'trending') {
        fetchProjectsByCategory({ tag: selectedCategory });
      }
      fetchTrendingProjects();
    }
  }, [
    selectedCategory,
    fetchLatestProjects,
    fetchProjectsByCategory,
    fetchTrendingProjects,
    isHomePage,
  ]);

  if (!isHomePage) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <Routes>{routes}</Routes>
      </Box>
    );
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
      {/* Latest projects */}
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <InPageNavigation
          routes={[selectedCategory || 'home', 'trending']}
          defaultHidden={['trending']}
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
                if (!selectedCategory) {
                  fetchLatestProjects(nextPage);
                } else if (selectedCategory !== 'trending') {
                  fetchProjectsByCategory({
                    page: nextPage,
                    tag: selectedCategory,
                  });
                }
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
          {trendingProjects && trendingProjects.length === 0 ? ( // FIX ME
            <NoBannerSkeleton count={3} />
          ) : trendingProjects && trendingProjects.length ? (
            trendingProjects.map((project, i) => {
              return (
                <NoBannerProjectCard key={i} project={project} index={i} />
              );
            })
          ) : (
            <NoDataMessageBox message="No trending projects" />
          )}
        </InPageNavigation>
      </Box>

      {/* filters and trending projects */}
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
        <Stack spacing={5}>
          <Box>
            <A2ZTypography
              variant="h6"
              text="Recommended topics"
              props={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {categories.map((category, i) => {
                return (
                  <CategoryButton
                    key={i}
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      );
                    }}
                  >
                    {category}
                  </CategoryButton>
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <A2ZTypography variant="h6" text="Trending" />
              <TrendingUpIcon fontSize="medium" />
            </Box>

            {trendingProjects && trendingProjects.length === 0 ? ( // FIX ME
              <NoBannerSkeleton count={3} />
            ) : trendingProjects && trendingProjects.length ? (
              trendingProjects.map((project, i) => {
                return (
                  <NoBannerProjectCard key={i} project={project} index={i} />
                );
              })
            ) : (
              <NoDataMessageBox message="No trending projects" />
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
