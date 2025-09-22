export interface UserProfile {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
  }
}

export interface SearchUserByNameResponse {
  users: UserProfile[];
}