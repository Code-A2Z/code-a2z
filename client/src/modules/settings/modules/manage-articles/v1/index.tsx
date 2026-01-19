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
    publishedArticles,
    draftArticles,
    query,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    handleLoadMore,
  } = useManageArticles();

  useEffect(() => {
    if (publishedArticles === null) {
      fetchProjects({ page: 1, is_draft: false, query });
    }
    if (draftArticles === null) {
      fetchProjects({ page: 1, is_draft: true, query });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedArticles, draftArticles, query]);

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
            `Published Articles (${publishedArticles?.totalDocs ?? 0})`,
            `Drafts (${draftArticles?.totalDocs ?? 0})`,
          ]}
          defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
        >
          {/* Published Articles */}
          {publishedArticles === null ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : publishedArticles.results.length ? (
            <>
              {publishedArticles.results.map((project, i) => (
                <ManagePublishedArticle
                  key={project._id || i}
                  project={project}
                  index={i}
                />
              ))}

              {publishedArticles.results.length <
                publishedArticles.totalDocs && (
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
          {draftArticles === null ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : draftArticles.results.length ? (
            <>
              {draftArticles.results.map((project, i) => (
                <ManageDraftArticle
                  key={project._id || i}
                  project={project}
                  index={i}
                />
              ))}

              {draftArticles.results.length < draftArticles.totalDocs && (
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
