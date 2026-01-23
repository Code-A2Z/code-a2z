import { useCallback, useMemo, useState } from 'react';
import { useSetAtom } from 'jotai';
import { HomePageProjectsAtom } from '../states';
import {
  getAllProjects,
  getTrendingProjects,
  searchProjects,
} from '../../../../infra/rest/apis/project';
import { homeRoutes, HOME_QUERY_PARAMS } from '../../routes';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ROUTES_V1 } from '../../../../app/routes/constants/routes';
import { getTrendingProjectsResponse } from '../../../../infra/rest/apis/project/typing';

const useHomeV1 = () => {
  const { routes } = homeRoutes();
  const location = useLocation();
  const [searchParams] = useSearchParams();
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
    [setProjects, isHomePage]
  );

  const fetchTrendingProjects = useCallback(async () => {
    if (!isHomePage) return;
    const response = await getTrendingProjects();
    if (response.data) {
      setTrendingProjects(response.data);
    }
  }, [setTrendingProjects, isHomePage]);

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
    [setProjects, isHomePage]
  );

  const searchTerm = useMemo(() => {
    const term = searchParams.get(HOME_QUERY_PARAMS.SEARCH_TERM);
    return term ? decodeURIComponent(term) : '';
  }, [searchParams]);

  const activeModule = useMemo(() => {
    if (searchTerm) {
      return 'search';
    }
    return 'home';
  }, [searchTerm]);

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
    searchTerm,
    activeModule,
  };
};

export default useHomeV1;
