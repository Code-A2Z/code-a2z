import { get, post } from '../..';
import { ApiResponse } from '../../typings';
import { SubmitFeedbackPayload, FeedbackItem } from './typing';

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  return post<SubmitFeedbackPayload, ApiResponse<{ feedback: FeedbackItem }>>(
    '/api/feedback/submit',
    true,
    payload
  );
};

export const getUserFeedback = async (params?: {
  limit?: number;
  skip?: number;
}) => {
  const { limit = 10, skip = 0 } = params || {};
  return get<
    undefined,
    ApiResponse<{ feedback: FeedbackItem[]; total: number; hasMore: boolean }>
  >(`/api/feedback/user?limit=${limit}&skip=${skip}`, true);
};
