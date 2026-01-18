import { Link as RouterLink } from 'react-router-dom';
import { Box, Avatar, Link, useTheme } from '@mui/material';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';

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
        p: 1.5,
        borderRadius: 2,
        transition: 'background-color 0.2s ease',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Avatar
        src={profile_img}
        alt={fullname}
        sx={{
          width: 56,
          height: 56,
          border: `1px solid ${theme.palette.divider}`,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <A2ZTypography
          variant="subtitle1"
          text={fullname}
          props={{
            sx: {
              fontWeight: 600,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
        <A2ZTypography
          variant="body2"
          text={`@${username}`}
          props={{
            sx: {
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </Box>
    </Link>
  );
};

export default UserCard;
