export interface Profile {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
    bio: string;
    email: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  social_links: {
    youtube: string;
    facebook: string;
    twitter: string;
    github: string;
    instagram: string;
    website: string;
  };
  joinedAt: string;
  role: number;
  _id: string;
}
