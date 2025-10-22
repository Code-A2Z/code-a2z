import { Comment } from './index';

export interface EditorBlock {
  type: string;
  data: {
    text?: string;
    level?: number;
    items?: string[];
    code?: string;
    caption?: string;
    stretched?: boolean;
    withBackground?: boolean;
    withBorder?: boolean;
    url?: string;
    source?: string;
    title?: string;
    description?: string;
    site_name?: string;
    image?: {
      url: string;
    };
    [key: string]:
      | string
      | number
      | boolean
      | string[]
      | { url: string }
      | undefined; // Allow other properties for extensibility
  };
}

export interface Project {
  description: any;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  project_id: string;
  title: string;
  banner: string;
  des: string;
  projectUrl?: string;
  repository?: string;
  content?: Array<{
    blocks: EditorBlock[];
  }>;
  tags: string[];
  author: {
    _id?: string;
    personal_info: {
      fullname: string;
      username: string;
      profile_img: string;
    };
  };
  publishedAt: string;
  comments?: {
    results: Comment[];
  };
  _id?: string;
}

export interface TrendingProject {
  project_id: string;
  title: string;
  author: {
    personal_info: {
      fullname: string;
      username: string;
      profile_img: string;
    };
  };
  publishedAt: string;
}

export interface AllProjectsData {
  results: Project[];
  page: number;
  totalDocs: number;
  deletedDocCount?: number;
}
