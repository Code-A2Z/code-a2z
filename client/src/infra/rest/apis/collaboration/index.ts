import { get, post } from '../..';
import { BaseApiResponse } from '../../typings';

export const inviteCollaboration = async (project_id: string) => {
  return post<{ project_id: string }, BaseApiResponse>(
    `/api/collaboration/${project_id}`,
    true
  );
};

export const projectCollaborators = async (project_id: string) => {
  return get<{ project_id: string }, BaseApiResponse>(
    `/api/collaboration/${project_id}`,
    true
  );
};
