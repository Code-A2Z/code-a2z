import { del, get, post } from '../..';
import ApiResponse, { BaseApiResponse } from '../../typing';
import {
  createProjectPayload,
  getAllProjectsResponse,
  getTrendingProjectsResponse,
  ProjectData,
  searchProjectsPayload,
  userProjectsCountPayload,
  userProjectsPayload,
  userProjectsResponse,
} from './typing';

export const createProject = async (projectData: createProjectPayload) => {
  return post<createProjectPayload, ApiResponse<{ id: string }>>(
    `/api/project`,
    true,
    projectData,
    false
  );
};

export const getAllProjects = async (page: number) => {
  return get<number, ApiResponse<getAllProjectsResponse[]>>(
    `/api/project/all`,
    false,
    undefined,
    false,
    { page: page }
  );
};

export const totalPublishedProjectsCount = async () => {
  return get<undefined, ApiResponse<{ totalDocs: number }>>(
    `/api/project/count`,
    false,
    undefined,
    false
  );
};

export const getTrendingProjects = async () => {
  return get<undefined, ApiResponse<getTrendingProjectsResponse[]>>(
    `/api/project/trending`,
    false,
    undefined,
    false
  );
};

export const searchProjects = async (queries: searchProjectsPayload) => {
  return get<searchProjectsPayload, ApiResponse<getAllProjectsResponse[]>>(
    `/api/project/search`,
    false,
    undefined,
    false,
    { queries }
  );
};

export const searchProjectsCount = async (queries: searchProjectsPayload) => {
  return get<searchProjectsPayload, ApiResponse<{ totalDocs: number }>>(
    `/api/project/search/count`,
    false,
    undefined,
    false,
    { queries }
  );
};

export const getProjectById = async (project_id: string) => {
  return get<undefined, ApiResponse<ProjectData>>(
    `/api/project/${project_id}`,
    false,
    undefined,
    false
  );
};

export const userProjects = async (queries: userProjectsPayload) => {
  return get<userProjectsPayload, ApiResponse<userProjectsResponse>>(
    `/api/project/user`,
    false,
    undefined,
    false,
    { queries }
  );
};

export const userProjectsCount = async (queries: userProjectsCountPayload) => {
  return get<userProjectsCountPayload, ApiResponse<{ totalDocs: number }>>(
    `/api/project/user/count`,
    false,
    undefined,
    false,
    { queries }
  );
};

export const deleteProjectById = async (project_id: string) => {
  return del<undefined, BaseApiResponse>(
    `/api/project/${project_id}`,
    true,
    undefined,
    false
  );
};
