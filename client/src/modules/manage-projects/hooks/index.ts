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
          const currentState = is_draft ? draftProjects : publishedProjects;
          const existingResults = currentState?.results || [];

          const formattedData: ManageProjectsPaginationState = {
            results:
              page === 1
                ? projectsResponse.data
                : [...existingResults, ...projectsResponse.data],
            page,
            totalDocs: countResponse.data.totalDocs || 0,
            deletedDocCount,
          };

          if (is_draft) {
            setDraftProjects(formattedData);
          } else {
            setPublishedProjects(formattedData);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    [
      isAuthenticated,
      setPublishedProjects,
      setDraftProjects,
      publishedProjects,
      draftProjects,
    ]
  );

  return {
    fetchProjects,
    publishedProjects,
    draftProjects,
  };
};

export default useManageProjects;
