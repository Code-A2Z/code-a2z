import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  userProfile,
  updateProfile,
  updateProfileImg,
} from '../../../infra/rest/apis/user';
import { uploadImage } from '../../../infra/rest/apis/media';
import { EditProfileAtom } from '../states';
import { UserAtom } from '../../../infra/states/user';

const useEditProfile = () => {
  const setProfile = useSetAtom(EditProfileAtom);
  const setUser = useSetAtom(UserAtom);
  const user = useAtomValue(UserAtom);
  const profile = useAtomValue(EditProfileAtom);

  const fetchProfile = useCallback(async () => {
    if (!user?.personal_info?.username) return;

    try {
      const response = await userProfile(user.personal_info.username);
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user?.personal_info?.username, setProfile]);

  const updateProfileImage = useCallback(
    async (imageFile: File) => {
      const uploadResponse = await uploadImage(imageFile);
      if (uploadResponse.data?.upload_url) {
        const response = await updateProfileImg(uploadResponse.data.upload_url);
        if (response.data && user) {
          const updatedUser = {
            ...user,
            personal_info: {
              ...user.personal_info,
              profile_img: response.data.profile_img,
            },
          };
          setUser(updatedUser);
          return response.data.profile_img;
        }
      }
    },
    [user, setUser]
  );

  const updateUserProfile = useCallback(
    async (profileData: {
      username: string;
      bio: string;
      social_links: {
        youtube: string;
        instagram: string;
        facebook: string;
        x: string;
        github: string;
        linkedin: string;
        website: string;
      };
    }) => {
      const response = await updateProfile(profileData);
      if (response.data && user) {
        const updatedUser = {
          ...user,
          personal_info: {
            ...user.personal_info,
            username: response.data.username,
          },
        };
        setUser(updatedUser);
      }
      return response;
    },
    [user, setUser]
  );

  return {
    fetchProfile,
    updateProfileImage,
    updateUserProfile,
    profile,
  };
};

export default useEditProfile;
