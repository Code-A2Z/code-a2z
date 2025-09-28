export interface Notification {
  id: string;
  message: string;
  open: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface NotificationData {
  _id: string;
  seen: boolean;
  type: string;
  createdAt: string;
  user?: {
    personal_info: {
      profile_img: string;
      fullname: string;
      username: string;
    };
    _id: string;
  };
  project?: {
    _id: string;
    title: string;
    project_id: string;
  };
  comment?: {
    comment: string;
    _id: string;
  };
  reply?: {
    comment: string;
    _id: string;
  };
  replied_on_comment?: {
    comment: string;
  };
}

export interface NotificationState {
  results: NotificationData[];
  totalDocs: number;
  page: number;
  deleteDocCount?: number;
}
