import { OutputData } from '@editorjs/editorjs';
import { PROJECT_ACTIVITY, USER_PERSONAL_LIMITED_INFO } from '../../typings';

export interface createProjectPayload {
  _id?: string;
  title: string;
  description?: string;
  banner_url?: string;
  live_url?: string;
  repository_url?: string;
  tags: Array<string>;
  content_blocks?: OutputData | Array<OutputData>;
  is_draft: boolean;
}

export interface getAllProjectsResponse {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  tags: Array<string>;
  activity: PROJECT_ACTIVITY;
  publishedAt: Date;
  personal_info: USER_PERSONAL_LIMITED_INFO;
}

export interface getTrendingProjectsResponse {
  _id: string;
  title: string;
  personal_info: USER_PERSONAL_LIMITED_INFO;
  publishedAt: Date;
}

export interface searchProjectsPayload {
  tag?: string;
  query?: string;
  user_id?: string;
  page?: number;
  limit?: number;
  rmv_project_by_id?: string;
}

export enum PROJECT_OPEN_MODE {
  READ = 'read',
  EDIT = 'edit',
}

export interface ProjectData {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  repository_url: string;
  live_url: string | null;
  tags: Array<string>;
  content_blocks: Array<OutputData>;
  user_id: {
    _id: string;
    personal_info: USER_PERSONAL_LIMITED_INFO;
  };
  activity: PROJECT_ACTIVITY;
  is_draft: boolean;
  publishedAt: Date;
}

export interface userProjectsPayload {
  is_draft: boolean;
  page: number;
  query?: string;
  deletedDocCount?: number;
}

export interface userProjectsResponse {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  activity: PROJECT_ACTIVITY;
  is_draft: boolean;
  publishedAt: Date;
}
