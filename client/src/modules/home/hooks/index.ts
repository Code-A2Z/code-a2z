import { useSetAtom } from 'jotai';
import { HomePageProjectsAtom, HomePageTrendingProjectsAtom } from '../states';
import {
  getAllProjects,
  getTrendingProjects,
  searchProjects,
} from '../../../infra/rest/apis/project';

const useHome = () => {
  const setProjects = useSetAtom(HomePageProjectsAtom);
  const setTrending = useSetAtom(HomePageTrendingProjectsAtom);

  const fetchLatestProjects = async (page = 1) => {
    const response = await getAllProjects(page);
    if (response.data) {
      setProjects(response.data);
    }
  };

  const fetchTrendingProjects = async () => {
    const response = await getTrendingProjects();
    if (response.data) {
      setTrending(response.data);
    }
  };

  const fetchProjectsByCategory = async ({
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
  };

  return {
    fetchLatestProjects,
    fetchTrendingProjects,
    fetchProjectsByCategory,
  };
};

export default useHome;
