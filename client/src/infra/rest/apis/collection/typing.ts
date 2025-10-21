export interface CreateCollectionResponse {
  user_id: string;
  collection_name: string;
  projects: [];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveProjectPayload {
  collection_id: string;
  project_id: string;
}

export interface SortProjectPayload {
  collection_id: string;
  sortBy: string;
}
