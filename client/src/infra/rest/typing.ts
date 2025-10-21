import { NotificationType } from '../../shared/typings';

export interface BaseApiResponse {
  status: NotificationType;
  message: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data?: T;
}
