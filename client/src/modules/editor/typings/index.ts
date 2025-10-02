import { EditorBlock } from '../../../shared/typings';

export enum EditorMode {
  EDITOR = 'editor',
  PUBLISH = 'publish',
}

export interface CreateProjectPayload {
  id?: string;
  title: string;
  banner: string;
  des: string;
  repository: string;
  projectUrl: string;
  content: Array<{
    blocks: EditorBlock[];
  }>;
  tags: string[];
  draft: boolean;
}

export interface CreateProjectResponse {
  success: boolean;
  project_id?: string;
}
