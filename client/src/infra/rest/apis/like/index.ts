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
  return get<undefined, { is_liked: boolean | null }>(
    `/api/like?project_id=${project_id}`,
    true
  );
};
