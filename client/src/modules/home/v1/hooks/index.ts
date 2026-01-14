import { useCallback, useMemo, useState } from 'react';
import { useSetAtom } from 'jotai';
import { HomePageProjectsAtom } from '../states';
import {
  getAllProjects,
  getTrendingProjects,
  searchProjects,
} from '../../../../infra/rest/apis/project';
import { homeRoutes } from '../../routes';
import { useLocation } from 'react-router-dom';
import { ROUTES_V1 } from '../../../../app/routes/constants/routes';
import { getTrendingProjectsResponse } from '../../../../infra/rest/apis/project/typing';

const useHomeV1 = () => {
  const { routes } = homeRoutes();
  const location = useLocation();
  const setProjects = useSetAtom(HomePageProjectsAtom);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [trendingProjects, setTrendingProjects] = useState<
    getTrendingProjectsResponse[]
  >([]);

  const isHomePage = useMemo(() => {
    const currentPath = location.pathname;
    const homeBasePath = ROUTES_V1.HOME;
    return currentPath === homeBasePath;
  }, [location.pathname]);

  const fetchLatestProjects = useCallback(
    async (page = 1) => {
      if (!isHomePage) return;
      const response = await getAllProjects(page);
      if (response.data) {
        setProjects(response.data);
      }
    },
    [setProjects]
  );

  const fetchTrendingProjects = useCallback(async () => {
    if (!isHomePage) return;
    const response = await getTrendingProjects();
    if (response.data) {
      setTrendingProjects(response.data);
    }
  }, [setTrendingProjects]);

  const fetchProjectsByCategory = useCallback(
    async ({
      tag,
      query,
      user_id,
      page = 1,
      limit = 10,
      rmv_project_by_id,
    }: {
      tag?: string;
      query?: string;
      user_id?: string;
      page?: number;
      limit?: number;
      rmv_project_by_id?: string;
    }) => {
      if (!isHomePage) return;
      const response = await searchProjects({
        tag,
        query,
        user_id,
        page,
        limit,
        rmv_project_by_id,
      });
      if (response.data) {
        setProjects(response.data);
      }
    },
    [setProjects]
  );

  return {
    routes,
    isHomePage,
    selectedCategory,
    setSelectedCategory,
    trendingProjects,
    setTrendingProjects,
    fetchLatestProjects,
    fetchTrendingProjects,
    fetchProjectsByCategory,
  };
};

export default useHomeV1;
