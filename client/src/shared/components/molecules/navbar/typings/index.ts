export interface SubscribeUserPayload {
    email: string;
}

export interface SubscribeUserResponse {
  status: number;
  message: string;
}

export interface CheckNewNotificationsResponse {
  status: number;
  data: {
    new_notification_available: boolean;
  };
}