import { del, get, post } from '../..';
import { ApiResponse, BaseApiResponse } from '../../typings';
import {
  createProjectPayload,
  getTrendingProjectsResponse,
  PROJECT_OPEN_MODE,
  ProjectData,
  searchProjectsPayload,
  userProjectsPayload,
  userProjectsResponse,
  getAllProjectsResponse,
} from './typing';

export const createProject = async (projectData: createProjectPayload) => {
  return post<createProjectPayload, ApiResponse<{ id: string }>>(
    `/api/project`,
    true,
    projectData
  );
};

export const getAllProjects = async (page: number) => {
  return get<undefined, ApiResponse<getAllProjectsResponse[]>>(
    `/api/project?page=${page}`
  );
};

export const totalPublishedProjectsCount = async () => {
  return get<undefined, ApiResponse<{ totalDocs: number }>>(
    `/api/project/count`
  );
};

export const getTrendingProjects = async () => {
  return get<undefined, ApiResponse<getTrendingProjectsResponse[]>>(
    `/api/project/trending`
  );
};

export const searchProjects = async ({
  tag,
  query,
  user_id,
  page,
  limit,
  rmv_project_by_id,
}: searchProjectsPayload) => {
  return get<undefined, ApiResponse<getAllProjectsResponse[]>>(
    `/api/project/search?tag=${tag}&query=${query}&user_id=${user_id}&page=${page}&limit=${limit}&rmv_project_by_id=${rmv_project_by_id}`
  );
};

export const searchProjectsCount = async ({
  tag,
  query,
  user_id,
}: searchProjectsPayload) => {
  return get<undefined, ApiResponse<{ totalDocs: number }>>(
    `/api/project/search/count?tag=${tag}&query=${query}&user_id=${user_id}`
  );
};

export const getProjectById = async (
  project_id: string,
  mode: string = PROJECT_OPEN_MODE.READ
) => {
  return get<undefined, ApiResponse<ProjectData>>(
    `/api/project/${project_id}?mode=${mode}`
  );
};

export const userProjects = async ({
  is_draft,
  page,
  query,
  deletedDocCount,
}: userProjectsPayload) => {
  return get<undefined, ApiResponse<userProjectsResponse>>(
    `/api/project/user?is_draft=${is_draft}&query=${query}&page=${page}&deletedDocCount=${deletedDocCount}`
  );
};

export const userProjectsCount = async ({
  is_draft,
  query,
}: userProjectsPayload) => {
  return get<undefined, ApiResponse<{ totalDocs: number }>>(
    `/api/project/user/count?is_draft=${is_draft}&query=${query}`
  );
};

export const deleteProjectById = async (project_id: string) => {
  return del<undefined, BaseApiResponse>(`/api/project/${project_id}`, true);
};
