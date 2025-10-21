import { get, post } from '../..';
import { BaseApiResponse } from '../../typing';

export const inviteCollaboration = async (project_id: string) => {
  return post<{ project_id: string }, BaseApiResponse>(
    `/api/collaboration/invite`,
    true,
    { project_id }
  );
};

export const projectCollaborators = async (project_id: string) => {
  return get<{ project_id: string }, BaseApiResponse>(
    `/api/collaboration`,
    true,
    { project_id },
    false
  );
};
