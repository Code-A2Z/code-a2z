export interface UserProfile {
  personal_info: {
    bio: any;
    fullname: string;
    username: string;
    profile_img: string;
  };
}

export interface SearchUserByNameResponse {
  users: UserProfile[];
}
