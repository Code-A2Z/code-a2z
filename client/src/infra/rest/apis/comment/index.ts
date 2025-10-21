import { del, get, post } from '../..';
import { BaseApiResponse } from '../../typing';
import {
  AddCommentPayload,
  AddCommentResponse,
  GetCommentsPayload,
  GetCommentsResponse,
  GetRepliesPayload,
} from './typing';

export const addComment = async (data: AddCommentPayload) => {
  return post<AddCommentPayload, AddCommentResponse>(
    `/api/comment`,
    true,
    data
  );
};

export const getComments = async (data: GetCommentsPayload) => {
  return get<GetCommentsPayload, GetCommentsResponse[]>(
    `/api/comment`,
    false,
    data
  );
};

export const getReplies = async (data: GetRepliesPayload) => {
  return get<GetRepliesPayload, GetCommentsResponse[]>(
    `/api/comment/replies`,
    false,
    data
  );
};

export const deleteComment = async (comment_id: string) => {
  return del<undefined, BaseApiResponse>(
    `/api/comment/${comment_id}`,
    true,
    undefined
  );
};
