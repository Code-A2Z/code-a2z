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
import { PAGE_SIZE } from '../constants';

const useHomeV1 = () => {
  const { routes } = homeRoutes();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setProjects = useSetAtom(HomePageProjectsAtom);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [trendingProjects, setTrendingProjects] = useState<
    getTrendingProjectsResponse[]
  >([]);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const isHomePage = useMemo(() => {
    const currentPath = location.pathname;
    const homeBasePath = ROUTES_V1.HOME;
    return currentPath === homeBasePath;
  }, [location.pathname]);

  const fetchLatestProjects = useCallback(
    async (page = 1) => {
      if (!isHomePage || isLoadingProjects) return;
      setIsLoadingProjects(true);
      try {
        const response = await getAllProjects(page);
        if (response.data && Array.isArray(response.data)) {
          // Check if there are more projects to load
          setHasMoreProjects(response.data.length === PAGE_SIZE);
          if (page === 1) {
            setProjects(response.data);
          } else {
            setProjects(prevProjects => [...prevProjects, ...response.data!]);
          }
        }
      } catch (error) {
        console.error('Error fetching latest projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    },
    [isHomePage, isLoadingProjects, setProjects]
  );

  const fetchTrendingProjects = useCallback(async () => {
    if (!isHomePage) return;
    const response = await getTrendingProjects();
    if (response.data) {
      setTrendingProjects(response.data);
    }
  }, [isHomePage, setTrendingProjects]);

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
      if (!isHomePage || isLoadingProjects) return;
      setIsLoadingProjects(true);
      try {
        const response = await searchProjects({
          tag,
          query,
          user_id,
          page,
          limit,
          rmv_project_by_id,
        });
        if (response.data && Array.isArray(response.data)) {
          // Check if there are more projects to load
          setHasMoreProjects(response.data.length === PAGE_SIZE);
          if (page === 1) {
            setProjects(response.data);
          } else {
            setProjects(prevProjects => [...prevProjects, ...response.data!]);
          }
        }
      } catch (error) {
        console.error('Error fetching projects by category:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    },
    [isHomePage, isLoadingProjects, setProjects]
  );

  const searchTerm = useMemo(() => {
    const term = searchParams.get(HOME_QUERY_PARAMS.SEARCH_TERM);
    return term ? decodeURIComponent(term) : '';
  }, [searchParams]);

  const activeModule = useMemo((): 'search' | 'home' => {
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
    hasMoreProjects,
    isLoadingProjects,
  };
};

export default useHomeV1;
