import { atom } from 'jotai';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface NotificationSystem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | NotificationType;
  open: boolean;
  autoHideDuration?: number; // in milliseconds
}

export const NotificationSystemAtom = atom<NotificationSystem[]>([]);
