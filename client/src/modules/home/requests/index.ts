import { get, post } from "../../../infra/rest";
import {
  GetAllProjectsPayload,
  GetAllProjectsResponse,
  GetTrendingProjectsResponse,
  SearchProjectsByCategoryPayload,
  SearchProjectsByCategoryResponse,
} from "../typings";

export const getAllLatestProjects = async (page: number) => {
  return post<GetAllProjectsResponse, GetAllProjectsPayload>(
    `/api/project/getall`,
    false,
    {
      page,
    },
  );
};

export const searchProjectByCategory = async (tag: string, page: number) => {
  return post<SearchProjectsByCategoryResponse, SearchProjectsByCategoryPayload>(
    `/api/project/search`,
    false,
    {
      tag,
      page,
    },
  );
};

export const getTrendingProjects = async () => {
  return get<GetTrendingProjectsResponse>(
    `/api/project/trending`,
    false,
  );
};
