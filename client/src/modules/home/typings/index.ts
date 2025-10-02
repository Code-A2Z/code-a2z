import { Project, TrendingProject } from '../../../shared/typings';

export interface GetAllProjectsPayload {
  page: number;
}

export interface GetAllProjectsResponse {
  projects: Project[];
}

export interface SearchProjectsByCategoryPayload {
  tag: string;
  page: number;
}

export interface SearchProjectsByCategoryResponse {
  projects: Project[];
}

export interface GetTrendingProjectsResponse {
  projects: TrendingProject[];
}
