import { del, get, patch, post } from '../..';
import ApiResponse, { BaseApiResponse } from '../../typing';
import {
  CreateCollectionResponse,
  SaveProjectPayload,
  SortProjectPayload,
} from './typing';

export const createCollection = async (collection_name: string) => {
  return post<
    { collection_name: string },
    ApiResponse<CreateCollectionResponse>
  >(`/api/collection`, true, { collection_name });
};

export const saveProject = async (data: SaveProjectPayload) => {
  return post<SaveProjectPayload, BaseApiResponse>(
    `/api/collection/save-project`,
    true,
    data
  );
};

export const sortProject = async (data: SortProjectPayload) => {
  return get<SortProjectPayload, BaseApiResponse>(
    `/api/collection/sort-projects`,
    true,
    undefined,
    false,
    { data }
  );
};

export const removeProject = async (data: SaveProjectPayload) => {
  return patch<SaveProjectPayload, BaseApiResponse>(
    `/api/collection/remove-project`,
    true,
    undefined,
    false,
    { data }
  );
};

export const deleteCollection = async (collection_id: string) => {
  return del<{ collection_id: string }, BaseApiResponse>(
    `/api/collection`,
    true,
    { collection_id }
  );
};
