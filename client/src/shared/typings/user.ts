export interface UserDBState {
  personal_info: {
    fullname: string;
    email: string;
    password: string;
    username: string;
    bio: string;
    profile_img: string;
  };
  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    linkedin: string;
    website: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  role: string;
  projects: Array<string>;
  collaborated_projects: Array<string>;
  collections: Array<string>;
  _id: string;
  joinedAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  access_token: string | null;
  username: string;
  name: string;
  email: string;
  profile_img: string;
  fullname: string;
  role: number;
  new_notification_available: boolean;
}
