export interface COLLECTION_DB_STATE {
  _id: string;
  user_id: string;
  collection_name: string;
  description: string;
  project_ids: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
