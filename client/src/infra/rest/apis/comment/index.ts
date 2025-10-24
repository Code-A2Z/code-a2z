import { del, get, post } from '../..';
import { ApiResponse, BaseApiResponse } from '../../typings';
import {
  AddCommentPayload,
  AddCommentResponse,
  GetCommentsPayload,
  GetCommentsResponse,
  GetRepliesPayload,
  GetRepliesResponse,
} from './typing';

export const addComment = async (data: AddCommentPayload) => {
  return post<AddCommentPayload, ApiResponse<AddCommentResponse>>(
    `/api/comment`,
    true,
    data
  );
};

export const getComments = async ({ project_id, skip }: GetCommentsPayload) => {
  return get<GetCommentsPayload, ApiResponse<GetCommentsResponse[]>>(
    `/api/comment?project_id=${project_id}&skip=${skip || 0}`
  );
};

export const getReplies = async ({ comment_id, skip }: GetRepliesPayload) => {
  return get<GetRepliesPayload, ApiResponse<GetRepliesResponse[]>>(
    `/api/comment/replies?comment_id=${comment_id}&skip=${skip || 0}`
  );
};

export const deleteComment = async (comment_id: string) => {
  return del<undefined, BaseApiResponse>(`/api/comment/${comment_id}`, true);
};
