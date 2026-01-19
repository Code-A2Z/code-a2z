import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import {
  userProjects,
  userProjectsCount,
} from '../../../../../../infra/rest/apis/project';
import {
  PublishedProjectsAtom,
  DraftProjectsAtom,
  ManageProjectsPaginationState,
} from '../states';

const useManageArticles = () => {
  const [publishedArticles, setPublishedArticles] = useAtom(
    PublishedProjectsAtom
  );
  const [draftArticles, setDraftArticles] = useAtom(DraftProjectsAtom);

  const [query, setQuery] = useState('');

  const fetchProjects = useCallback(
    async (params: {
      page: number;
      is_draft: boolean;
      query?: string;
      deletedDocCount?: number;
    }) => {
      const { page, is_draft, query = '', deletedDocCount = 0 } = params;

      try {
        const [projectsResponse, countResponse] = await Promise.all([
          userProjects({ is_draft, page, query, deletedDocCount }),
          userProjectsCount({ is_draft, query, page: 1 }),
        ]);

        if (projectsResponse.data && countResponse.data) {
          const totalDocs = countResponse.data.totalDocs || 0;
          const newResults = projectsResponse.data || [];

          if (is_draft) {
            setDraftArticles(
              (prevState: ManageProjectsPaginationState | null) => {
                const previousResults = prevState?.results || [];

                const results =
                  page === 1 || !prevState
                    ? newResults
                    : [...previousResults, ...newResults];

                return {
                  results,
                  page,
                  totalDocs,
                  deletedDocCount,
                };
              }
            );
          } else {
            setPublishedArticles(
              (prevState: ManageProjectsPaginationState | null) => {
                const previousResults = prevState?.results || [];

                const results =
                  page === 1 || !prevState
                    ? newResults
                    : [...previousResults, ...newResults];

                return {
                  results,
                  page,
                  totalDocs,
                  deletedDocCount,
                };
              }
            );
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    [setPublishedArticles, setDraftArticles]
  );

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (!value.length) {
      setPublishedArticles(null);
      setDraftArticles(null);
    }
  };

  const handleSearchSubmit = () => {
    if (query.length) {
      setPublishedArticles(null);
      setDraftArticles(null);
    }
  };

  const handleSearchClear = () => {
    setQuery('');
    setPublishedArticles(null);
    setDraftArticles(null);
  };

  const handleLoadMore = (is_draft: boolean) => {
    const currentState = is_draft ? draftArticles : publishedArticles;
    if (currentState && currentState.results.length < currentState.totalDocs) {
      fetchProjects({
        page: currentState.page + 1,
        is_draft,
        query,
        deletedDocCount: currentState.deletedDocCount || 0,
      });
    }
  };

  return {
    fetchProjects,
    publishedArticles,
    draftArticles,
    query,
    setQuery,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    handleLoadMore,
  };
};

export default useManageArticles;
