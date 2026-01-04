import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  userProjects,
  userProjectsCount,
} from '../../../infra/rest/apis/project';
import {
  PublishedProjectsAtom,
  DraftProjectsAtom,
  ManageProjectsPaginationState,
} from '../states';
import { useAuth } from '../../../shared/hooks/use-auth';

const useManageProjects = () => {
  const setPublishedProjects = useSetAtom(PublishedProjectsAtom);
  const setDraftProjects = useSetAtom(DraftProjectsAtom);
  const publishedProjects = useAtomValue(PublishedProjectsAtom);
  const draftProjects = useAtomValue(DraftProjectsAtom);
  const { isAuthenticated } = useAuth();

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

          if (is_draft) {
            setDraftProjects((prevState: ManageProjectsPaginationState | undefined) => {
              const previousResults = prevState?.results || [];

              const results =
                page === 1 || !prevState
                  ? projectsResponse.data
                  : [...previousResults, ...projectsResponse.data];

              return {
                results,
                page,
                totalDocs,
                deletedDocCount,
              };
            });
          } else {
            setPublishedProjects(
              (prevState: ManageProjectsPaginationState | undefined) => {
                const previousResults = prevState?.results || [];

                const results =
                  page === 1 || !prevState
                    ? projectsResponse.data
                    : [...previousResults, ...projectsResponse.data];

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

  return {
    fetchProjects,
    publishedProjects,
    draftProjects,
  };
};

export default useManageProjects;
