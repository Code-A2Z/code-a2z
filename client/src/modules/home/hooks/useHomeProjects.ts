import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { filterPaginationData } from '../../../shared/requests/filter-pagination-data';
import {
  AllProjectsAtom,
  TrendingProjectAtom,
} from '../../../shared/states/project';
import { useNotifications } from '../../../shared/hooks/use-notification';
import {
  getAllLatestProjects,
  getTrendingProjects,
  searchProjectByCategory,
} from '../requests';
import type { Project, AllProjectsData } from '../../../infra/rest/typings';

export const useHomeProjects = (pageState: string) => {
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [trendingProjects, setTrendingProjects] = useAtom(TrendingProjectAtom);
  const { addNotification } = useNotifications();

  const fetchLatestProjects = useCallback(
    async ({ page = 1 }) => {
      const response = await getAllLatestProjects(page);
      if (response.projects.length > 0) {
        const formattedData = await filterPaginationData<Project>({
          state: projects,
          data: response.projects,
          page,
          countRoute: '/api/project/all-latest-count',
        });
        if (formattedData?.results) {
          setProjects(formattedData as AllProjectsData);
        } else {
          addNotification({
            message: 'No Project Found!',
            type: 'error',
          });
        }
      } else {
        addNotification({
          message: 'No Projects Found!',
          type: 'error',
        });
      }
    },
    [projects, addNotification, setProjects]
  );

  const fetchProjectsByCategory = useCallback(
    async ({ page = 1 }) => {
      const response = await searchProjectByCategory(pageState, page);
      if (response.projects.length > 0) {
        const formattedData = await filterPaginationData<Project>({
          state: projects,
          data: response.projects,
          page,
          countRoute: '/api/project/search-count',
          data_to_send: { tag: pageState },
        });
        if (formattedData) {
          setProjects(formattedData as AllProjectsData);
        }
      }
    },
    [projects, pageState, setProjects]
  );

  const fetchTrendingProjects = useCallback(async () => {
    const response = await getTrendingProjects();
    if (response.projects.length > 0) {
      setTrendingProjects(response.projects);
    }
  }, [setTrendingProjects]);

  return {
    projects,
    trendingProjects,
    setProjects,
    fetchLatestProjects,
    fetchProjectsByCategory,
    fetchTrendingProjects,
  };
};
