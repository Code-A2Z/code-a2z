import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import NoDataMessageBox from '../../shared/components/atoms/no-data-msg';
import ManagePublishedProjectCard from './components/publish-projects';
import ManageDraftProjectPost from './components/draft-projects';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ManageProjects = () => {
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [drafts, setDrafts] = useAtom(DraftProjectAtom);
  const user = useAtomValue(UserAtom);

  const activeTab = useSearchParams()[0].get('tab');
  const [query, setQuery] = useState('');

  const getProjects = useCallback(
    (params: Record<string, unknown>) => {
      const { page = 1, draft = false, deletedDocCount = 0 } = params;

      userWrittenProjects({
        page: page as number,
        draft: draft as boolean,
        query,
        deletedDocCount: deletedDocCount as number,
      })
        .then(async data => {
          const formattedData = (await filterPaginationData({
            state: draft ? drafts : projects,
            data: data.projects || [],
            page: page as number,
            countRoute: '/search-projects-count',
            data_to_send: {
              query,
              tag: query,
              author: user.username || '',
              draft,
            },
          })) as AllProjectsData;

          if (formattedData) {
            if (draft) {
              setDrafts(formattedData);
            } else {
              setProjects(formattedData);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    [drafts, projects, query, setDrafts, setProjects, user.username]
  );

  useEffect(() => {
    if (user.access_token) {
      if (projects === null) {
        getProjects({ page: 1, draft: false });
      }
      if (drafts === null) {
        getProjects({ page: 1, draft: true });
      }
    }
  }, [user.access_token, projects, drafts, query, getProjects]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchQuery = e.currentTarget.value;
    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setProjects(null);
      setDrafts(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value.length) {
      setQuery('');
      setProjects(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ display: { xs: 'none', md: 'block' }, mb: 2 }}>
        Manage Projects
      </Typography>

      <Box sx={{ my: { xs: 2, md: 3 }, mb: 5 }}>
        <TextField
          fullWidth
          placeholder="Search Projects"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <InPageNavigation
        routes={["Published Projects", "Drafts"]}
        defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
      >
        {
          // Published Projects
          projects === null ? (
            <Loader />
          ) : projects.results.length ? (
            <>
              {projects.results.map((project, i) => {
                return (
                  <ManagePublishedProjectCard
                    key={i}
                    project={{
                      ...project,
                      index: i,
                      setStateFunc: setProjects,
                    }}
                  />
                );
              })}

              <LoadMoreDataBtn
                state={projects}
                fetchDataFun={getProjects}
                additionalParam={{
                  draft: false,
                  deletedDocCount: projects.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessageBox message="No Published Projects" />
          )
        }

        {
          // Draft Projects
          drafts === null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((project, i) => {
                return (
                  <ManageDraftProjectPost
                    key={i}
                    project={{
                      ...project,
                      index: i,
                      setStateFunc: setDrafts,
                    }}
                  />
                );
              })}

              <LoadMoreDataBtn
                state={drafts}
                fetchDataFun={getProjects}
                additionalParam={{
                  draft: true,
                  deletedDocCount: drafts.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessageBox message="No Draft Projects" />
          )
        }
      </InPageNavigation>
    </>
  );
};

export default ManageProjects;
