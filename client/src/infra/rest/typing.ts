import { NotificationType } from '../../shared/typings';

export interface BaseApiResponse {
  status: NotificationType;
  message: string;
}

interface ApiResponse<T> extends BaseApiResponse {
  data?: T;
}

export default ApiResponse;
