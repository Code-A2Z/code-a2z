import { get, patch } from '../..';
import { LikeProjectPayload, LikeProjectResponse } from './typing';

export const likeProject = async (data: LikeProjectPayload) => {
  return patch<LikeProjectPayload, LikeProjectResponse>(
    `/api/like`,
    true,
    data
  );
};

export const likeStatus = async (project_id: string) => {
  return get<string, { isLiked: boolean }>(
    `/api/like`,
    true,
    undefined,
    false,
    { project_id }
  );
};
