import { OutputData } from '@editorjs/editorjs';

export interface PROJECT_ACTIVITY {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  total_parent_comments: number;
}

export interface PROJECT_DB_STATE {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  repository_url: string;
  live_url: string | null;
  tags: Array<string>;
  content_blocks: Array<OutputData> | OutputData;
  user_id: string;
  activity: PROJECT_ACTIVITY;
  is_draft: boolean;
  comment_ids: Array<string>;
  collaborator_ids: Array<string>;
  createdAt: string;
  updatedAt: string;
}
