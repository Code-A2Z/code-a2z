export interface Project {
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
    blocks: Array<{
      type: string;
      data: any;
    }>;
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
};

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
};

export interface AllProjectsData {
  results: Project[];
};