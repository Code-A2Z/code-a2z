import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import NoDataMessageBox from '../../shared/components/atoms/no-data-msg';
import ManagePublishedProjectCard from './components/publish-projects';
import ManageDraftProjectPost from './components/draft-projects';
import useManageProjects from './hooks';
import { Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBox from '../../shared/components/atoms/input-box';
import A2ZTypography from '../../shared/components/atoms/typography';
import Button from '../../shared/components/atoms/button';
import { useSetAtom } from 'jotai';
import { PublishedProjectsAtom, DraftProjectsAtom } from './states';

const ManageProjects = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');
  const [query, setQuery] = useState('');
  const { fetchProjects, publishedProjects, draftProjects } =
    useManageProjects();
  const setPublishedProjects = useSetAtom(PublishedProjectsAtom);
  const setDraftProjects = useSetAtom(DraftProjectsAtom);

  useEffect(() => {
    if (publishedProjects === null) {
      fetchProjects({ page: 1, is_draft: false, query });
    }
    if (draftProjects === null) {
      fetchProjects({ page: 1, is_draft: true, query });
    }
  }, [publishedProjects, draftProjects, fetchProjects, query]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.length) {
      setPublishedProjects(null);
      setDraftProjects(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setQuery(value);
    if (!value.length) {
      setPublishedProjects(null);
      setDraftProjects(null);
    }
  };

  const handleLoadMore = (is_draft: boolean) => {
    const currentState = is_draft ? draftProjects : publishedProjects;
    if (currentState && currentState.results.length < currentState.totalDocs) {
      fetchProjects({
        page: currentState.page + 1,
        is_draft,
        query,
        deletedDocCount: currentState.deletedDocCount || 0,
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <A2ZTypography
        variant="h4"
        text="Manage Projects"
        props={{ sx: { mb: 4, display: { xs: 'none', md: 'block' } } }}
      />

      <Box sx={{ mb: 4, position: 'relative' }}>
        <InputBox
          id="manage-projects-search"
          name="search"
          type="text"
          placeholder="Search Projects"
          defaultValue={query}
          icon={<SearchIcon />}
          sx={{ width: '100%' }}
          slotProps={{
            htmlInput: {
              onChange: handleChange,
              onKeyDown: handleSearch,
            },
          }}
        />
      </Box>

      <InPageNavigation
        routes={['Published Projects', 'Drafts']}
        defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
      >
        {/* Published Projects */}
        {publishedProjects === null ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : publishedProjects.results.length ? (
          <>
            {publishedProjects.results.map((project, i) => (
              <ManagePublishedProjectCard
                key={project._id || i}
                project={project}
                index={i}
              />
            ))}

            {publishedProjects.results.length < publishedProjects.totalDocs && (
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
          <NoDataMessageBox message="No Published Projects" />
        )}

        {/* Draft Projects */}
        {draftProjects === null ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : draftProjects.results.length ? (
          <>
            {draftProjects.results.map((project, i) => (
              <ManageDraftProjectPost
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
          <NoDataMessageBox message="No Draft Projects" />
        )}
      </InPageNavigation>
    </Box>
  );
};

export default ManageProjects;
