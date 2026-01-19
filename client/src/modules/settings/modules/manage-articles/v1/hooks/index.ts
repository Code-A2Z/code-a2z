import { useCallback, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  userProjects,
  userProjectsCount,
} from '../../../../../../infra/rest/apis/project';
import {
  PublishedProjectsAtom,
  DraftProjectsAtom,
  ManageProjectsPaginationState,
} from '../states';
import { useAuth } from '../../../../../../shared/hooks/use-auth';

const useManageArticles = () => {
  const setPublishedProjects = useSetAtom(PublishedProjectsAtom);
  const setDraftProjects = useSetAtom(DraftProjectsAtom);
  const publishedProjects = useAtomValue(PublishedProjectsAtom);
  const draftProjects = useAtomValue(DraftProjectsAtom);
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');

  const fetchProjects = useCallback(
    async (params: {
      page: number;
      is_draft: boolean;
      query?: string;
      deletedDocCount?: number;
    }) => {
      if (!isAuthenticated()) return;

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
            setDraftProjects(
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
            setPublishedProjects(
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
    [isAuthenticated, setPublishedProjects, setDraftProjects]
  );

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (!value.length) {
      setPublishedProjects(null);
      setDraftProjects(null);
    }
  };

  const handleSearchSubmit = () => {
    if (query.length) {
      setPublishedProjects(null);
      setDraftProjects(null);
    }
  };

  const handleSearchClear = () => {
    setQuery('');
    setPublishedProjects(null);
    setDraftProjects(null);
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

  return {
    fetchProjects,
    publishedProjects,
    draftProjects,
    query,
    setQuery,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    handleLoadMore,
  };
};

export default useManageArticles;
