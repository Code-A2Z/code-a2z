import { useRef, useState, useEffect } from 'react';
import { Box, Avatar, Button, Stack, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { AVATAR_SIZE, ACCEPTED_IMAGE_TYPES } from '../constants';
import { ProfileImageUploadProps } from '../typings';

const ProfileImageUpload = ({
  currentImage,
  fullname,
  onImageSelect,
  onUpload,
  uploading,
  disabled = false,
}: ProfileImageUploadProps) => {
  const profileImgInputRef = useRef<HTMLInputElement>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Clear preview when upload completes successfully
  useEffect(() => {
    if (!uploading && selectedFile) {
      // Upload completed, clear the preview
      setPreviewImg(null);
      setSelectedFile(null);
      if (profileImgInputRef.current) {
        profileImgInputRef.current.value = '';
      }
    }
  }, [uploading, selectedFile]);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.currentTarget.files?.[0];
    if (img) {
      const previewUrl = URL.createObjectURL(img);
      setPreviewImg(previewUrl);
      setSelectedFile(img);
      onImageSelect(img);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error uploading image:', error);
    }
  };

  const handleAvatarClick = () => {
    if (!disabled) {
      profileImgInputRef.current?.click();
    }
  };

  return (
    <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={previewImg || currentImage}
          alt={fullname}
          sx={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            bgcolor: 'grey.300',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: disabled ? 1 : 0.8,
            },
          }}
          onClick={handleAvatarClick}
        />
        {!disabled && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              p: 1,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={handleAvatarClick}
          >
            <PhotoCameraIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        )}
        <input
          ref={profileImgInputRef}
          onChange={handleImagePreview}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          hidden
          disabled={disabled}
        />
      </Box>

      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!selectedFile || uploading || disabled}
        fullWidth
        sx={{
          maxWidth: AVATAR_SIZE,
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
    </Stack>
  );
};

export default ProfileImageUpload;
