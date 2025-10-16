export interface searchUserResponse {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
  };
}

export interface getUserProfileResponse {
  _id: string;
  personal_info: {
    fullname: string;
    email: string;
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
  joinedAt: string;
}

export interface updateProfilePayload {
  username: string;
  bio: string;
  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    linkedin: string;
    website: string;
  };
}
