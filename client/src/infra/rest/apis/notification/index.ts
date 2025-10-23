import { get } from '../..';
import { ApiResponse } from '../../typings';
import {
  AllNotificationsCountPayload,
  GetNotificationsPayload,
  GetNotificationsResponse,
} from './typing';

export const getNotifications = async ({
  page,
  filter,
  deletedDocCount,
}: GetNotificationsPayload) => {
  return get<GetNotificationsPayload, ApiResponse<GetNotificationsResponse[]>>(
    `/api/notification?page=${page || 1}&filter=${filter || 'all'}&deletedDocCount=${deletedDocCount || 0}`,
    true
  );
};

export const notificationStatus = async () => {
  return get<undefined, ApiResponse<{ new_notification_available: boolean }>>(
    `/api/notification/status`,
    true
  );
};

export const allNotificationCounts = async ({
  filter,
}: AllNotificationsCountPayload) => {
  return get<AllNotificationsCountPayload, ApiResponse<{ totalDocs: number }>>(
    `/api/notification/count?filter=${filter || 'all'}`,
    true
  );
};
