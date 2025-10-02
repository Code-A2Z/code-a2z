export interface GetUserProfileResponse {
  personal_info: {
    fullname: string;
    email: string;
    username: string;
    bio: string;
    profile_img: string;
  };
  social_links: {
    youtube: string;
    facebook: string;
    twitter: string;
    github: string;
    instagram: string;
    website: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  _id: string;
  role: number;
  joinedAt: string;
}

export interface UploadProfileImageResponse {
  profile_img: string;
}

export interface UpdateProfileResponse {
  message: string;
  username: string;
}
