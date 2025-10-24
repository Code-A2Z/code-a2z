import {
  NOTIFICATION_FILTER_TYPE,
  USER_PERSONAL_LIMITED_INFO,
} from '../../typings';

export interface GetNotificationsPayload {
  page?: number;
  filter?: NOTIFICATION_FILTER_TYPE;
  deletedDocCount?: number;
}

export interface GetNotificationsResponse {
  _id: string;
  type: NOTIFICATION_FILTER_TYPE;
  seen: boolean;
  project_id: {
    _id: string;
    title: string;
  };
  comment_id?: {
    _id: string;
    comment: string;
  };
  replied_on_comment_id?: {
    _id: string;
    comment: string;
  };
  createdAt: Date;
  personal_info: USER_PERSONAL_LIMITED_INFO;
}

export interface AllNotificationsCountPayload {
  filter?: NOTIFICATION_FILTER_TYPE;
}
