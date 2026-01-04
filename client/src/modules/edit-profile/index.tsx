import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../../shared/hooks/use-notification';
import { bioLimit } from './constants';
import { useAuth } from '../../shared/hooks/use-auth';
import useEditProfile from './hooks';
import {
  Box,
  Avatar,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import A2ZTypography from '../../shared/components/atoms/typography';
import InputBox from '../../shared/components/atoms/input-box';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

const EditProfile = () => {
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const { fetchProfile, updateProfileImage, updateUserProfile, profile } =
    useEditProfile();

  const profileImgInputRef = useRef<HTMLInputElement>(null);
  const editProfileForm = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    youtube: '',
    facebook: '',
    twitter: '',
    github: '',
    instagram: '',
    website: '',
  });

  useEffect(() => {
    if (isAuthenticated()) {
      fetchProfile().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.personal_info.username || '',
        bio: profile.personal_info.bio || '',
        youtube: profile.social_links.youtube || '',
        facebook: profile.social_links.facebook || '',
        twitter: profile.social_links.x || '',
        github: profile.social_links.github || '',
        instagram: profile.social_links.instagram || '',
        website: profile.social_links.website || '',
      });
      if (profile.personal_info?.bio) {
        setCharactersLeft(bioLimit - profile.personal_info.bio.length);
      }
    }
  }, [profile]);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setFormData(prev => ({ ...prev, bio: value }));
    setCharactersLeft(bioLimit - value.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.currentTarget.files?.[0];
    if (img) {
      setPreviewImg(URL.createObjectURL(img));
      setUpdatedProfileImg(img);
    }
  };

  const handleImageUpload = async () => {
    if (!updatedProfileImg) return;

    setUploading(true);
    try {
      await updateProfileImage(updatedProfileImg);
      addNotification({
        message: 'Profile Image Updated',
        type: 'success',
      });
      setUpdatedProfileImg(null);
      setPreviewImg(null);
      if (profileImgInputRef.current) {
        profileImgInputRef.current.value = '';
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to update profile image',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

    if (username.length < 3) {
      return addNotification({
        message: 'Username should be atleast 3 characters long',
        type: 'error',
      });
    }

    if (bio.length > bioLimit) {
      return addNotification({
        message: `Bio should be less than ${bioLimit} characters`,
        type: 'error',
      });
    }

    setSaving(true);

    try {
      await updateUserProfile({
        username,
        bio: bio || '',
        social_links: {
          youtube: youtube || '',
          facebook: facebook || '',
          x: twitter || '',
          github: github || '',
          instagram: instagram || '',
          linkedin: profile?.social_links.linkedin || '',
          website: website || '',
        },
      });
      addNotification({
        message: 'Profile Updated',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    personal_info: { fullname, username, profile_img, bio },
    social_links,
  } = profile;

  const socialIcons: Record<string, React.ReactNode> = {
    youtube: <YouTubeIcon />,
    facebook: <FacebookIcon />,
    twitter: <TwitterIcon />,
    github: <GitHubIcon />,
    instagram: <InstagramIcon />,
    website: <LanguageIcon />,
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <A2ZTypography
        variant="h4"
        text="Edit Profile"
        props={{ sx: { mb: 4, display: { xs: 'none', md: 'block' } } }}
      />

      <Box
        component="form"
        ref={editProfileForm}
        onSubmit={handleSubmit}
        sx={{ py: 4 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Profile Image Section */}
          <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={previewImg || profile_img}
                  alt={fullname}
                  sx={{
                    width: 192,
                    height: 192,
                    bgcolor: 'grey.300',
                    cursor: 'pointer',
                  }}
                  onClick={() => profileImgInputRef.current?.click()}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  onClick={() => profileImgInputRef.current?.click()}
                >
                  <PhotoCameraIcon sx={{ color: 'white' }} />
                </Box>
                <input
                  ref={profileImgInputRef}
                  onChange={handleImagePreview}
                  type="file"
                  accept=".jpeg,.png,.jpg"
                  hidden
                />
              </Box>

              <Button
                variant="outlined"
                onClick={handleImageUpload}
                disabled={!updatedProfileImg || uploading}
                fullWidth
                sx={{ maxWidth: 192 }}
              >
                {uploading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </Stack>
          </Box>

          {/* Form Fields */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <InputBox
                  id="edit-profile-fullname"
                  name="fullname"
                  type="text"
                  value={fullname}
                  placeholder="Full Name"
                  disabled
                  icon={<PersonIcon />}
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box>
                <InputBox
                  id="edit-profile-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="Username"
                  icon={<AlternateEmailIcon />}
                  slotProps={{
                    htmlInput: {
                      onChange: handleInputChange,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  Username will be used to search user and will be visible to
                  all users
                </Typography>
              </Box>

              <Box>
                <TextField
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  placeholder="Bio"
                  fullWidth
                  inputProps={{ maxLength: bioLimit }}
                  onChange={handleCharacterChange}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  {charactersLeft} characters left
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Add your social handles below
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  {['youtube', 'facebook', 'twitter', 'github', 'instagram', 'website'].map(key => {
                    const fieldName = key as keyof typeof formData;
                    return (
                      <InputBox
                        key={key}
                        id={`edit-profile-${key}`}
                        name={key}
                        type="text"
                        value={formData[fieldName]}
                        placeholder="https://"
                        icon={socialIcons[key] || <LanguageIcon />}
                        sx={{
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                        }}
                        slotProps={{
                          htmlInput: {
                            onChange: handleInputChange,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{
                  py: 1.2,
                  fontSize: '1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                }}
              >
                {saving ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
