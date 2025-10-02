import { post, del } from '../../../infra/rest';
import { Comment } from '../../../shared/typings';
import { Project } from '../../../shared/typings/project';
import {
  CommentNotificationPayload,
  CommentNotificationResponse,
  GetProjectResponse,
  LikeStatusResponse,
  SearchSimilarProjectsResponse,
  GetCommentsPayload,
  GetRepliesPayload,
  GetRepliesResponse,
  DeleteCommentPayload,
  DeleteCommentResponse,
  GetProjectPayload,
} from '../typings';

export const getProject = async ({
  project_id,
  draft,
  mode,
}: GetProjectPayload) => {
  return post<GetProjectResponse, GetProjectPayload>(
    `/api/project/get`,
    false,
    {
      project_id,
      draft,
      mode,
    }
  );
};

export const searchSimilarProjects = async ({
  tag,
  limit,
  elminate_project,
}: {
  tag: string;
  limit: number;
  elminate_project?: string;
}) => {
  return post<
    SearchSimilarProjectsResponse,
    { tag: string; limit: number; eliminate_project?: string }
  >(`/api/project/search`, false, {
    tag,
    limit,
    eliminate_project: elminate_project,
  });
};

export const likeStatus = async ({ _id }: { _id: string }) => {
  return post<LikeStatusResponse, { _id: string }>(
    `/api/notification/like-status`,
    false,
    {
      _id,
    }
  );
};

export const likeNotification = async ({
  _id,
  islikedByUser,
}: {
  _id: string;
  islikedByUser: boolean;
}) => {
  return post<{ success: boolean }, { _id: string; islikedByUser: boolean }>(
    `/api/notification/like`,
    true,
    {
      _id,
      islikedByUser,
    }
  );
};

export const commentNotification = async ({
  _id,
  comment,
  project_author,
  replying_to,
}: {
  _id: string;
  comment: string;
  project_author: string;
  replying_to?: string;
}) => {
  return post<CommentNotificationResponse, CommentNotificationPayload>(
    `/api/notification/comment`,
    true,
    {
      _id,
      comment,
      project_author,
      replying_to,
    }
  );
};

export const getComments = async ({
  project_id,
  skip = 0,
}: GetCommentsPayload) => {
  return post<Comment[], GetCommentsPayload>(
    `/api/notification/get-comments`,
    false,
    {
      project_id,
      skip,
    }
  );
};

export const getReplies = async ({ _id, skip = 0 }: GetRepliesPayload) => {
  return post<GetRepliesResponse, GetRepliesPayload>(
    `/api/notification/get-replies`,
    false,
    {
      _id,
      skip,
    }
  );
};

export const deleteComment = async ({ _id }: DeleteCommentPayload) => {
  return del<DeleteCommentResponse, DeleteCommentPayload>(
    `/api/notification/delete-comment`,
    true,
    {
      _id,
    }
  );
};

export const userWrittenProjects = async ({
  page,
  draft,
  query = '',
  deletedDocCount = 0,
}: {
  page: number;
  draft: boolean;
  query?: string;
  deletedDocCount?: number;
}) => {
  return post<
    { projects: Project[] },
    { page: number; draft: boolean; query?: string; deletedDocCount?: number }
  >(`/api/project/user-written`, true, {
    page,
    draft,
    query,
    deletedDocCount,
  });
};

export const deleteProject = async ({ project_id }: { project_id: string }) => {
  return post<{ success: boolean }, { project_id: string }>(
    `/api/project/delete`,
    true,
    {
      project_id,
    }
  );
};
