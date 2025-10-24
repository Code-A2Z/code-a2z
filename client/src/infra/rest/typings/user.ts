export interface USER_PERSONAL_INFO {
  fullname: string;
  subscriber_id: string;
  password?: string;
  username: string;
  bio: string;
  profile_img: string;
}

export interface USER_SOCIAL_LINKS {
  youtube: string;
  instagram: string;
  facebook: string;
  x: string;
  github: string;
  linkedin: string;
  website: string;
}

export interface USER_ACCOUNT_INFO {
  total_posts: number;
  total_reads: number;
}

export interface USER_DB_STATE {
  _id: string;
  personal_info: USER_PERSONAL_INFO;
  social_links: USER_SOCIAL_LINKS;
  account_info: USER_ACCOUNT_INFO;
  role: string;
  project_ids: Array<string>;
  collaborated_projects_ids: Array<string>;
  collections_ids: Array<string>;
  joinedAt: string;
  updatedAt: string;
}

export interface USER_PERSONAL_LIMITED_INFO {
  fullname: string;
  username: string;
  profile_img: string;
}
