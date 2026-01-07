import { useCallback } from 'react';
import { userProfile } from '../../../infra/rest/apis/user';
import { useParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { ProfileAtom } from '../states';
import useHomeV1 from '../../home/v1/hooks';

const useProfile = () => {
  const { username } = useParams();
  const setProfile = useSetAtom(ProfileAtom);
  const { fetchProjectsByCategory } = useHomeV1();

  const fetchUserProfile = useCallback(async () => {
    if (!username) return;
    const response = await userProfile(username);
    if (response.data) {
      setProfile(response.data);
      await fetchProjectsByCategory({ user_id: response.data._id });
    }
  }, [username, setProfile, fetchProjectsByCategory]);

  return {
    fetchUserProfile,
  };
};

export default useProfile;
