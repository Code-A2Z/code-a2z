import { get, patch } from '../..';
import { ApiResponse } from '../../typings';
import {
  getUserProfileResponse,
  searchUserResponse,
  updateProfilePayload,
} from './typing';

export const searchUser = async (query: string, page: number) => {
  return get<undefined, ApiResponse<searchUserResponse[]>>(
    `/api/user/search?query=${query}&page=${page}`
  );
};

export const userProfile = async (username: string) => {
  return get<undefined, ApiResponse<getUserProfileResponse>>(
    `/api/user/profile?username=${username}`
  );
};

export const updateProfileImg = async (imageUrl: string) => {
  return patch<{ url: string }, ApiResponse<{ profile_img: string }>>(
    `/api/user/update-profile-img`,
    true,
    { url: imageUrl }
  );
};

export const updateProfile = async (profileData: updateProfilePayload) => {
  return patch<updateProfilePayload, ApiResponse<{ username: string }>>(
    `/api/user/update-profile`,
    true,
    profileData
  );
};
