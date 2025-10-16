import { get, patch, post } from '../..';
import ApiResponse, { BaseApiResponse } from '../../typing';
import { getAllSubscribersResponse } from './typing';

export const subscribeAPI = async (email: string) => {
  return post<{ email: string }, BaseApiResponse>(
    `/api/subscriber/subscribe`,
    false,
    { email },
    false
  );
};

export const unsubscribeAPI = async (email: string) => {
  return patch<{ email: string }, BaseApiResponse>(
    `/api/subscriber/unsubscribe`,
    true,
    { email },
    false
  );
};

export const getAllSubscribers = async () => {
  return get<undefined, ApiResponse<getAllSubscribersResponse[]>>(
    `/api/subscriber/all`,
    true,
    undefined,
    false
  );
};
