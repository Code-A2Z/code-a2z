import { NotificationType } from './notification';

export * from './user';
export * from './subscriber';
export * from './project';
export * from './notification';
export * from './comment';
export * from './collection';
export * from './collaboration';

export interface BaseApiResponse {
  status: NotificationType;
  message: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data?: T;
}
