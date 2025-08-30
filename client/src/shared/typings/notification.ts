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
