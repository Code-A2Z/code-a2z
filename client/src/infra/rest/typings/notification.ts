export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Notification {
  id: string;
  message: string;
  open: boolean;
  type?: NotificationType;
  autoHideDuration?: number;
}

export enum NOTIFICATION_ACTION_TYPE {
  ALL = 'all',
  LIKE = 'like',
  COMMENT = 'comment',
  REPLY = 'reply',
}

export interface NOTIFICATION_DB_STATE {
  _id: string;
  type: NOTIFICATION_ACTION_TYPE;
  seen: boolean;
  project_id: string;
  user_id: string; // The user who performed the action
  author_id: string; // The user who receives this notification
  comment_id?: string;
  reply_id?: string;
  replied_on_comment_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
