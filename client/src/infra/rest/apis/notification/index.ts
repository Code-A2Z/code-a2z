import { get } from '../..';
import ApiResponse, { BaseApiResponse } from '../../typing';
import {
  AllNotificationsCountPayload,
  GetNotificationsPayload,
} from './typing';

export const getNotifications = async (data: GetNotificationsPayload) => {
  return get<GetNotificationsPayload, BaseApiResponse>(
    `/api/notification`,
    true,
    undefined,
    false,
    { data }
  );
};

export const notificationStatus = async () => {
  return get<undefined, ApiResponse<{ new_notification_available: boolean }>>(
    `/api/notification/status`,
    true
  );
};

export const allNotificationCounts = async (
  data: AllNotificationsCountPayload
) => {
  return get<AllNotificationsCountPayload, ApiResponse<{ totalDocs: number }>>(
    `/api/notification/count`,
    true,
    undefined,
    false,
    { data }
  );
};
