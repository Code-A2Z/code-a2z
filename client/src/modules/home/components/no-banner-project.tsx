import { Link } from 'react-router-dom';
import { Avatar, Box, Typography, Stack, useTheme } from '@mui/material';
import { getTrendingProjectsResponse } from '../../../infra/rest/apis/project/typing';
import { getDay } from '../../../shared/utils/date';

interface NoBannerProjectCardProps {
  project: getTrendingProjectsResponse;
  index: number;
}

const NoBannerProjectCard = ({ project, index }: NoBannerProjectCardProps) => {
  const theme = useTheme();

  const {
    _id,
    title,
    personal_info: { fullname, username, profile_img },
    publishedAt,
  } = project;

  return (
    <Box
      component={Link}
      to={`/project/${_id}`}
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .project-title': {
          color: theme.palette.primary.main,
        },
      }}
    >
      {/* Index Number */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          minWidth: 40,
          textAlign: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        {index < 10 ? `0${index + 1}` : index}
      </Typography>

      {/* Main Content */}
      <Box>
        {/* Author Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Avatar
            src={profile_img}
            alt={fullname}
            sx={{ width: 24, height: 24 }}
          />
          <Typography
            variant="body2"
            noWrap
            sx={{ maxWidth: 160, color: theme.palette.text.primary }}
          >
            {fullname} @{username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              minWidth: 'fit-content',
              color: theme.palette.text.secondary,
            }}
          >
            {getDay(publishedAt)}
          </Typography>
        </Stack>

        {/* Project Title */}
        <Typography
          className="project-title"
          variant="h6"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoBannerProjectCard;
