import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  Link,
  useTheme,
  capitalize,
} from '@mui/material';

interface UserCardProps {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
  };
}

const UserCard = ({ personal_info }: UserCardProps) => {
  const { fullname, username, profile_img } = personal_info;
  const theme = useTheme();

  return (
    <Link
      component={RouterLink}
      to={`/user/${username}`}
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2.5,
        p: 1,
        borderRadius: 2,
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        },
      }}
    >
      <Avatar src={profile_img} alt={fullname} sx={{ width: 56, height: 56 }} />

      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {capitalize(fullname)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          @{username}
        </Typography>
      </Box>
    </Link>
  );
};

export default UserCard;
