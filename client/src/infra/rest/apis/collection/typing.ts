import {
  PROJECT_ACTIVITY,
  PROJECT_CONTENT_BLOCKS,
  USER_PERSONAL_LIMITED_INFO,
} from '../../typings';

export interface CreateCollectionPayload {
  collection_name: string;
  description: string;
}

export interface CreateCollectionResponse {
  user_id: string;
  collection_name: string;
  description: string;
  projects: string[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveProjectPayload {
  collection_id: string;
  project_id: string;
}

export enum SortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  LIKES = 'likes',
}

export interface SortProjectPayload {
  collection_id: string;
  sort_by: SortBy;
}

export interface SortProjectResponse {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  repository_url: string;
  live_url: string | null;
  tags: Array<string>;
  content_blocks: Array<PROJECT_CONTENT_BLOCKS>;
  user_id: {
    _id: string;
    personal_info: USER_PERSONAL_LIMITED_INFO;
  };
  activity: PROJECT_ACTIVITY;
  is_draft: boolean;
  comment_ids: Array<string>;
  collaborator_ids: Array<string>;
  publishedAt: string;
  updatedAt: string;
}
