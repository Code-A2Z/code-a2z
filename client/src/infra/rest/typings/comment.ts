export interface COMMENT_DB_STATE {
  _id: string;
  project_id: string;
  comment: string;
  children_comment_ids: Array<string>;
  user_id: string;
  is_reply: boolean;
  parent_comment_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
