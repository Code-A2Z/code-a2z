import { get, patch, post } from '../..';
import { ApiResponse, BaseApiResponse } from '../../typings';
import { getAllSubscribersResponse } from './typing';

export const subscribeUser = async (email: string) => {
  return post<{ email: string }, BaseApiResponse>(
    `/api/subscriber/subscribe`,
    false,
    { email }
  );
};

export const unsubscribeUser = async (email: string) => {
  return patch<{ email: string }, BaseApiResponse>(
    `/api/subscriber/unsubscribe`,
    true,
    { email }
  );
};

export const getAllSubscribers = async () => {
  return get<undefined, ApiResponse<getAllSubscribersResponse[]>>(
    `/api/subscriber`,
    true
  );
};
