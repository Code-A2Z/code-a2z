import { atom } from 'jotai';
import { GetNotificationsResponse } from '../../../infra/rest/apis/notification/typing';

export interface NotificationPaginationState {
  results: GetNotificationsResponse[];
  page: number;
  totalDocs: number;
  deleteDocCount?: number;
}

export const NotificationsAtom = atom<NotificationPaginationState | null>(null);
