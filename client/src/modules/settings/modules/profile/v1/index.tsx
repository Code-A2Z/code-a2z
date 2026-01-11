import { useNotifications } from '../../../../../shared/hooks/use-notification';
import useProfileSettings from './hooks';
import { Box, Button, TextField, Stack, CircularProgress } from '@mui/material';
import A2ZTypography from '../../../../../shared/components/atoms/typography';
import InputBox from '../../../../../shared/components/atoms/input-box';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ProfileImageUpload from './components/profile-image-upload';
import SocialLinkInput from './components/social-link-input';
import { AVATAR_SIZE, BIO_LIMIT } from './constants';

const ProfileSettings = () => {
  const { addNotification } = useNotifications();
  const {
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
    handleSocialLinkChange,
  } = useProfileSettings();

  const handleImageUploadWithNotification = async () => {
    try {
      await handleImageUpload();
      addNotification({
        message: 'Profile Image Updated',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to update profile image',
        type: 'error',
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
      addNotification({
        message: 'Profile Updated',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const validationError =
        error instanceof Error ? error.message : undefined;

      addNotification({
        message:
          err.response?.data?.error ||
          validationError ||
          'Failed to update profile',
        type: 'error',
      });
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    personal_info: { fullname, profile_img },
  } = user;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Box component="form" onSubmit={handleFormSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: AVATAR_SIZE },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ProfileImageUpload
              currentImage={profile_img}
              fullname={fullname}
              onImageSelect={handleImageSelect}
              onUpload={handleImageUploadWithNotification}
              uploading={uploading}
            />
          </Box>

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
                <A2ZTypography
                  text="Username will be used to search user and will be visible to all users"
                  variant="caption"
                  props={{
                    sx: {
                      mt: 0.5,
                      display: 'block',
                      color: 'text.secondary',
                    },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  placeholder="Bio"
                  fullWidth
                  inputProps={{ maxLength: BIO_LIMIT }}
                  onChange={handleCharacterChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    },
                  }}
                />
                <A2ZTypography
                  text={`${charactersLeft} characters left`}
                  variant="caption"
                  props={{
                    sx: {
                      mt: 0.5,
                      display: 'block',
                      color: 'text.secondary',
                    },
                  }}
                />
              </Box>

              <SocialLinkInput
                formData={formData.social_links}
                onChange={handleSocialLinkChange}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{
                  py: 1.2,
                  fontSize: '1rem',
                  borderRadius: 2,
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

export default ProfileSettings;
