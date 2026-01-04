import { Avatar, Box } from '@mui/material';
import { CSSProperties, useMemo } from 'react';

export const profileAvatarSize = 42;

const ProfileAvatar = ({
  name = '',
  profilePicture,
  styles,
}: {
  name?: string;
  profilePicture?: string;
  styles?: CSSProperties;
}) => {
  const displayName = useMemo(
    () =>
      (name ?? '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim()
        ?.charAt(0)
        .toUpperCase() ?? '0',
    [name]
  );

  const avatarSx = {
    width: `${profileAvatarSize}px`,
    height: `${profileAvatarSize}px`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    bgcolor: 'action.selected',
    color: 'text.primary',
    ...styles,
  };

  if (profilePicture) {
    return <Avatar src={profilePicture} alt={displayName} sx={avatarSx} />;
  }

  return <Box sx={avatarSx}>{displayName}</Box>;
};

export default ProfileAvatar;
