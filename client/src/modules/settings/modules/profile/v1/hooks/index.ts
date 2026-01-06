import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  updateProfile,
  updateProfileImg,
} from '../../../../../../infra/rest/apis/user';
import { uploadImage } from '../../../../../../infra/rest/apis/media';
import { UserAtom } from '../../../../../../infra/states/user';
import { USER_DB_STATE } from '../../../../../../infra/rest/typings';
import { ProfileFormData, UpdateProfilePayload } from '../typings';
import { BIO_LIMIT, MIN_USERNAME_LENGTH } from '../constants';

interface UseProfileSettingsReturn {
  user: USER_DB_STATE | null;
  formData: ProfileFormData;
  charactersLeft: number;
  uploading: boolean;
  saving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCharacterChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageSelect: (file: File) => void;
  handleImageUpload: () => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  validateForm: (formData: ProfileFormData) => {
    isValid: boolean;
    error?: string;
  };
  handleSocialLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useProfileSettings = (): UseProfileSettingsReturn => {
  const setUser = useSetAtom(UserAtom);
  const user = useAtomValue(UserAtom);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [charactersLeft, setCharactersLeft] = useState(BIO_LIMIT);

  // Initialize form data from UserAtom
  const initialFormData = useMemo<ProfileFormData>(() => {
    if (!user) {
      return {
        username: '',
        bio: '',
        social_links: {
          youtube: '',
          facebook: '',
          x: '',
          github: '',
          instagram: '',
          linkedin: '',
          website: '',
        },
      };
    }

    return {
      username: user.personal_info.username || '',
      bio: user.personal_info.bio || '',
      social_links: {
        youtube: user.social_links.youtube || '',
        facebook: user.social_links.facebook || '',
        x: user.social_links.x || '',
        github: user.social_links.github || '',
        instagram: user.social_links.instagram || '',
        linkedin: user.social_links.linkedin || '',
        website: user.social_links.website || '',
      },
    };
  }, [user]);

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  // Update form data when user changes
  useEffect(() => {
    setFormData(initialFormData);
    if (initialFormData.bio) {
      setCharactersLeft(BIO_LIMIT - initialFormData.bio.length);
    } else {
      setCharactersLeft(BIO_LIMIT);
    }
  }, [initialFormData]);

  const validateForm = useCallback(
    (data: ProfileFormData): { isValid: boolean; error?: string } => {
      if (data.username.length < MIN_USERNAME_LENGTH) {
        return {
          isValid: false,
          error: `Username should be at least ${MIN_USERNAME_LENGTH} characters long`,
        };
      }

      if (data.bio.length > BIO_LIMIT) {
        return {
          isValid: false,
          error: `Bio should be less than ${BIO_LIMIT} characters`,
        };
      }

      return { isValid: true };
    },
    []
  );

  const handleSocialLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [name]: value,
        },
      }));
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      // Handle social links fields
      if (
        [
          'youtube',
          'facebook',
          'x',
          'github',
          'instagram',
          'linkedin',
          'website',
        ].includes(name)
      ) {
        setFormData(prev => ({
          ...prev,
          social_links: {
            ...prev.social_links,
            [name]: value,
          },
        }));
      } else {
        // Handle other fields like username
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleCharacterChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.currentTarget.value;
      setFormData(prev => ({ ...prev, bio: value }));
      setCharactersLeft(BIO_LIMIT - value.length);
    },
    []
  );

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImageFile(file);
  }, []);

  const updateProfileImage = useCallback(
    async (imageFile: File): Promise<string | null> => {
      if (!user) return null;

      try {
        const uploadResponse = await uploadImage(imageFile);
        if (uploadResponse.data?.upload_url) {
          const response = await updateProfileImg(
            uploadResponse.data.upload_url
          );
          if (response.data && user) {
            const updatedUser: USER_DB_STATE = {
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
        return null;
      } catch (error) {
        console.error('Error updating profile image:', error);
        throw error;
      }
    },
    [user, setUser]
  );

  const handleImageUpload = useCallback(async () => {
    if (!selectedImageFile) return;

    setUploading(true);
    try {
      await updateProfileImage(selectedImageFile);
      setSelectedImageFile(null);
    } finally {
      setUploading(false);
    }
  }, [selectedImageFile, updateProfileImage]);

  const updateUserProfile = useCallback(
    async (profileData: UpdateProfilePayload) => {
      if (!user) {
        throw new Error('User not found');
      }

      try {
        const response = await updateProfile(profileData);
        if (response.data && user) {
          const updatedUser: USER_DB_STATE = {
            ...user,
            personal_info: {
              ...user.personal_info,
              username: response.data.username,
              bio: profileData.bio,
            },
            social_links: {
              ...user.social_links,
              ...profileData.social_links,
            },
          };
          setUser(updatedUser);
        }
        return response;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    [user]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validation = validateForm(formData);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setSaving(true);

      try {
        await updateUserProfile({
          username: formData.username,
          bio: formData.bio || '',
          social_links: formData.social_links,
        });
      } finally {
        setSaving(false);
      }
    },
    [formData, validateForm, updateUserProfile]
  );

  return {
    user,
    formData,
    charactersLeft,
    uploading,
    saving,
    handleInputChange,
    handleCharacterChange,
    handleImageSelect,
    handleImageUpload,
    handleSubmit,
    validateForm,
    handleSocialLinkChange,
  };
};

export default useProfileSettings;
