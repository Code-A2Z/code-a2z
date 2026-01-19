import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InPageNavigation from '../../../../../shared/components/molecules/page-navigation';
import NoDataMessageBox from '../../../../../shared/components/atoms/no-data-msg';
import ManagePublishedArticle from './components/publish-articles';
import ManageDraftArticle from './components/draft-articles';
import useManageArticles from './hooks';
import { Box, CircularProgress } from '@mui/material';
import Button from '../../../../../shared/components/atoms/button';
import Header from '../../../../../shared/components/organisms/header';

const ManageArticles = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');
  const {
    fetchProjects,
    publishedProjects,
    draftProjects,
    query,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    handleLoadMore,
  } = useManageArticles();

  useEffect(() => {
    if (publishedProjects === null) {
      fetchProjects({ page: 1, is_draft: false, query });
    }
    if (draftProjects === null) {
      fetchProjects({ page: 1, is_draft: true, query });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedProjects, draftProjects, query]);

  return (
    <>
      <Header
        enableSearch
        searchTerm={query}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
      />

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          p: { xs: 1.5, md: 2 },
          bgcolor: 'background.paper',
        }}
      >
        <InPageNavigation
          routes={[
            `Published Articles (${publishedProjects?.totalDocs ?? 0})`,
            `Drafts (${draftProjects?.totalDocs ?? 0})`,
          ]}
          defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
        >
          {/* Published Articles */}
          {publishedProjects === null ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : publishedProjects.results.length ? (
            <>
              {publishedProjects.results.map((project, i) => (
                <ManagePublishedArticle
                  key={project._id || i}
                  project={project}
                  index={i}
                />
              ))}

              {publishedProjects.results.length <
                publishedProjects.totalDocs && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={() => handleLoadMore(false)}
                    variant="outlined"
                    size="medium"
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <NoDataMessageBox message="No Published Articles" />
          )}

          {/* Draft Articles */}
          {draftProjects === null ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : draftProjects.results.length ? (
            <>
              {draftProjects.results.map((project, i) => (
                <ManageDraftArticle
                  key={project._id || i}
                  project={project}
                  index={i}
                />
              ))}

              {draftProjects.results.length < draftProjects.totalDocs && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={() => handleLoadMore(true)}
                    variant="outlined"
                    size="medium"
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <NoDataMessageBox message="No Draft Articles" />
          )}
        </InPageNavigation>
      </Box>
    </>
  );
};

export default ManageArticles;
