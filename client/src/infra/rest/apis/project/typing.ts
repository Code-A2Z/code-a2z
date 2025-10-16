export interface createProjectPayload {
  title: string;
  des: string;
  banner: boolean;
  project_url?: string;
  repository: string;
  tags: Array<string>;
  content: [
    {
      blocks: [
        {
          type: string;
          data: {
            text: string;
            level?: number;
            items?: Array<string>;
            style?: string;
            file?: {
              url: string;
            };
            caption?: string;
            withBorder?: boolean;
            withBackground?: boolean;
            stretched?: boolean;
          };
        },
      ];
    },
  ];
  draft: boolean;
  id?: string;
}

export interface getAllProjectsResponse {
  project_id: string;
  title: string;
  banner: string;
  des: string;
  tags: Array<string>;
  author: {
    personal_info: {
      fullname: string;
      username: string;
      profile_img: string;
    };
  };
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  publishedAt: string;
}

export interface getTrendingProjectsResponse {
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

export interface searchProjectsPayload {
  tag?: string;
  query?: string;
  author?: string;
  page?: number;
  limit?: number;
}

export interface ProjectData {
  _id: string;
  project_id: string;
  title: string;
  banner: string;
  des: string;
  project_url?: string;
  repository: string;
  content: [
    {
      blocks: [
        {
          type: string;
          data: {
            text: string;
            level?: number;
            items?: Array<string>;
            style?: string;
            file?: {
              url: string;
            };
            caption?: string;
            withBorder?: boolean;
            withBackground?: boolean;
            stretched?: boolean;
          };
        },
      ];
    },
  ];
  tags: Array<string>;
  author: {
    _id: string;
    personal_info: {
      fullname: string;
      username: string;
      profile_img: string;
    };
  };
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  draft: boolean;
  publishedAt: string;
}

export interface userProjectsPayload {
  draft: boolean;
  page: number;
  deletedDocCount: number;
}

export interface userProjectsResponse {
  project_id: string;
  title: string;
  banner: string;
  des: string;
  tags: Array<string>;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  draft: boolean;
  publishedAt: string;
}

export interface userProjectsCountPayload {
  query?: string;
  draft?: boolean;
}
