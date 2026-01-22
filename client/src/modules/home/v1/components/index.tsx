import { Box, Stack } from '@mui/material';
import A2ZTypography from '../../../../shared/components/atoms/typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CATEGORIES } from '../constants';
import { CategoryButton } from './category-button';
import InPageNavigation from '../../../../shared/components/molecules/page-navigation';
import NoBannerProjectCard from './no-banner-project';
import { useAtomValue } from 'jotai';
import { HomePageProjectsAtom } from '../states';
import BannerProjectCard from './banner-project-card';
import NoDataMessageBox from '../../../../shared/components/atoms/no-data-msg';
import {
  BannerSkeleton,
  NoBannerSkeleton,
} from '../../../../shared/components/atoms/skeleton';
import { Virtuoso } from 'react-virtuoso';
import { getTrendingProjectsResponse } from '../../../../infra/rest/apis/project/typing';
import { PAGE_SIZE } from '../../../../shared/constants';

interface HomeContentProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  trendingProjects: getTrendingProjectsResponse[];
  fetchLatestProjects: (page?: number) => void;
  fetchProjectsByCategory: (params: { tag?: string; page?: number }) => void;
}

const HomeContent = ({
  selectedCategory,
  setSelectedCategory,
  trendingProjects,
  fetchLatestProjects,
  fetchProjectsByCategory,
}: HomeContentProps) => {
  const projects = useAtomValue(HomePageProjectsAtom);

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
                const nextPage = Math.floor(projects.length / PAGE_SIZE) + 1;
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
                  ) : null,
              }}
            />
          ) : (
            <NoDataMessageBox message="No projects available" />
          )}
          {trendingProjects && trendingProjects.length === 0 ? (
            <NoBannerSkeleton count={3} />
          ) : trendingProjects && trendingProjects.length ? (
            trendingProjects.map((project, i) => (
              <NoBannerProjectCard key={i} project={project} index={i} />
            ))
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
          maxHeight: 'calc(100vh - 130px)', 
          overflowY: 'auto',                
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
              {CATEGORIES.map((category, i) => (
                <CategoryButton
                  key={i}
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory === category ? null : category,
                    );
                  }}
                >
                  {category}
                </CategoryButton>
              ))}
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

            {trendingProjects && trendingProjects.length === 0 ? (
              <NoBannerSkeleton count={3} />
            ) : trendingProjects && trendingProjects.length ? (
              trendingProjects.map((project, i) => (
                <NoBannerProjectCard key={i} project={project} index={i} />
              ))
            ) : (
              <NoDataMessageBox message="No trending projects" />
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomeContent;
