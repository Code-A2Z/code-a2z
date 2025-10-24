import { del, get, patch, post } from '../..';
import { ApiResponse, BaseApiResponse } from '../../typings';
import {
  CreateCollectionPayload,
  CreateCollectionResponse,
  SaveProjectPayload,
  SortProjectPayload,
  SortProjectResponse,
} from './typing';

export const createCollection = async (data: CreateCollectionPayload) => {
  return post<CreateCollectionPayload, ApiResponse<CreateCollectionResponse>>(
    `/api/collection`,
    true,
    data
  );
};

export const saveProject = async (data: SaveProjectPayload) => {
  return post<SaveProjectPayload, BaseApiResponse>(
    `/api/collection/save-project`,
    true,
    data
  );
};

export const sortProject = async ({
  collection_id,
  sort_by,
}: SortProjectPayload) => {
  return get<SortProjectPayload, ApiResponse<SortProjectResponse[]>>(
    `/api/collection/sort-projects?collection_id=${collection_id}&sort_by=${sort_by}`,
    true
  );
};

export const removeProject = async (data: SaveProjectPayload) => {
  return patch<SaveProjectPayload, BaseApiResponse>(
    `/api/collection/remove-project`,
    true,
    data
  );
};

export const deleteCollection = async (collection_id: string) => {
  return del<{ collection_id: string }, BaseApiResponse>(
    `/api/collection/${collection_id}`,
    true
  );
};
