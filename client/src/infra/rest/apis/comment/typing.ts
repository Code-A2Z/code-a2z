import { USER_PERSONAL_LIMITED_INFO } from '../../typings';

export interface AddCommentPayload {
  project_id: string;
  comment: string;
  replying_to?: string;
  notification_id?: string;
}

export interface AddCommentResponse {
  _id: string;
  comment: string;
  createdAt: Date;
  user_id: string;
  children_comment_ids: string[];
}

export interface GetCommentsPayload {
  project_id: string;
  skip?: number;
}

export interface GetCommentsResponse {
  _id: string;
  project_id: string;
  comment: string;
  children_comment_ids: string[];
  is_reply: boolean;
  parent_comment_id: string | null;
  personal_info: USER_PERSONAL_LIMITED_INFO;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetRepliesPayload {
  comment_id: string;
  skip?: number;
}

export interface GetRepliesResponse {
  _id: string;
  comment: string;
  children_comment_ids: string[];
  is_reply: boolean;
  parent_comment_id: string | null;
  personal_info: USER_PERSONAL_LIMITED_INFO;
  createdAt: Date;
}
