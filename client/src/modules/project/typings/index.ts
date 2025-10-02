import { Project, Comment } from '../../../shared/typings';

export interface GetProjectPayload {
  project_id: string;
  draft?: boolean;
  mode?: string;
}

export interface GetProjectResponse {
  project: Project;
}

export interface SearchSimilarProjectsResponse {
  projects: Project[];
}

export interface LikeStatusResponse {
  isLiked: boolean;
}

export interface CommentNotificationPayload {
  _id: string;
  comment: string;
  project_author: string;
  replying_to?: string;
}

export interface CommentNotificationResponse {
  _id: string;
  comment: string;
  commentedAt: string;
  user_id: string;
  children: string[];
  commented_by?: {
    personal_info: {
      username: string;
      fullname: string;
      profile_img: string;
    };
  };
  childrenLevel?: number;
  parentIndex?: number;
}

export interface GetCommentsPayload {
  project_id: string;
  skip?: number;
}

export interface GetRepliesPayload {
  _id: string;
  skip?: number;
}

export interface GetRepliesResponse {
  replies: Comment[];
}

export interface DeleteCommentPayload {
  _id: string;
}

export interface DeleteCommentResponse {
  success: boolean;
}
