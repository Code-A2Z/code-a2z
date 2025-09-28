import { post } from '../../../infra/rest';
import {
  GetUserProfileResponse,
  UpdateProfileResponse,
  UploadProfileImageResponse,
} from '../typings';

export const getUserProfile = async (username: string) => {
  return post<GetUserProfileResponse, { username: string }>(
    `/api/user/profile`,
    false,
    {
      username,
    }
  );
};

export const uploadProfileImage = async (url: string) => {
  return post<UploadProfileImageResponse, { url: string }>(
    `/api/user/upload-profile-img`,
    true,
    {
      url,
    }
  );
};

export const updateProfile = async (
  username: string,
  bio: string,
  youtube: string,
  facebook: string,
  twitter: string,
  github: string,
  instagram: string,
  website: string
) => {
  return post<
    UpdateProfileResponse,
    {
      username: string;
      bio: string;
      social_links: {
        youtube: string;
        facebook: string;
        twitter: string;
        github: string;
        instagram: string;
        website: string;
      };
    }
  >(`/api/user/update-profile`, true, {
    username,
    bio,
    social_links: {
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    },
  });
};
