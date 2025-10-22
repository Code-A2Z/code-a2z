import {
  USER_ACCOUNT_INFO,
  USER_PERSONAL_INFO,
  USER_SOCIAL_LINKS,
} from '../../typings';

export interface searchUserResponse {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
  };
}

export interface getUserProfileResponse {
  _id: string;
  personal_info: USER_PERSONAL_INFO;
  social_links: USER_SOCIAL_LINKS;
  account_info: USER_ACCOUNT_INFO;
  role: string;
  joinedAt: string;
}

export interface updateProfilePayload {
  username: string;
  bio: string;
  social_links: USER_SOCIAL_LINKS;
}
