import { post } from '../../infra/rest';

interface PaginationState<T = unknown> {
  results: T[];
  page: number;
  totalDocs?: number;
}

interface FilterPaginationDataParams<T = unknown> {
  create_new_arr?: boolean;
  state: PaginationState<T> | null;
  data: T[];
  page: number;
  countRoute: string;
  data_to_send?: Record<string, unknown>;
}

export interface FilterPaginationDataResponse {
  totalDocs: number;
}

export const filterPaginationData = async <T = unknown>({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
}: FilterPaginationDataParams<T>): Promise<PaginationState<T> | undefined> => {
  let obj: PaginationState<T>;

  if (state !== null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    const response = await post<
      FilterPaginationDataResponse,
      Record<string, unknown>
    >(countRoute, false, data_to_send);
    if (response.totalDocs >= 0) {
      obj = { results: data, page: 1, totalDocs: response.totalDocs };
    } else {
      console.error(response);
      return undefined;
    }
  }

  return obj;
};
