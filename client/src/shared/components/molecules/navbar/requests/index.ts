import { get, post } from "../../../../../infra/rest";
import {
  CheckNewNotificationsResponse,
  SubscribeUserPayload,
  SubscribeUserResponse,
} from "../typings";

export const checkNewNotifications = async () => {
  return get<CheckNewNotificationsResponse, null>(
    `/api/notifications/new`,
    true
  );
};

export const subscribeUser = async (email: string) => {
  return post<SubscribeUserResponse, SubscribeUserPayload>(
    `/api/subscriber/subscribe`,
    false,
    {
      email,
    }
  );
};
