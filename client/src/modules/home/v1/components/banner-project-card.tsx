// TODO: Redesign this component to make it more visually appealing & interactive.
import { Link } from 'react-router-dom';
import { Avatar, Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useA2ZTheme } from '../../../../shared/hooks/use-theme';
import { getDay } from '../../../../shared/utils/date';
import {
  defaultDarkThumbnail,
  defaultLightThumbnail,
} from '../../../editor/constants';
import { getAllProjectsResponse } from '../../../../infra/rest/apis/project/typing';

const BannerProjectCard = ({
  project,
}: {
  project: getAllProjectsResponse;
}) => {
  const theme = useTheme();
  const { theme: a2zTheme } = useA2ZTheme();
  const {
    publishedAt,
    tags,
    title,
    description,
    banner_url,
    activity: { total_likes },
    _id,
    personal_info: { fullname, username, profile_img },
  } = project;

  return (
    <Box
      component={Link}
      to={`/project/${_id}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        pb: 3,
        mb: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .project-title': {
          color: theme.palette.primary.main,
        },
      }}
    >
      {/* LEFT SIDE */}
      <Box sx={{ flex: 1 }}>
        {/* Author Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Avatar
            src={profile_img}
            alt={fullname}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="body2" noWrap>
            {fullname} @{username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getDay(publishedAt)}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography
          variant="h6"
          className="project-title"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontFamily: "'Gelasio', serif",
            lineHeight: 1.6,
            display: { xs: 'none', sm: 'block', md: 'none', lg: 'block' },
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            displayWebkitBox: 'true',
          }}
        >
          {description}
        </Typography>

        {/* Tags + Likes */}
        <Stack direction="row" spacing={3} alignItems="center" mt={2}>
          {tags?.[0] && (
            <Chip // TODO: Create a customizable A2ZChip component having properties clickable, filterable, etc.
              label={tags[0]}
              sx={{
                py: 0.5,
                px: 2,
                borderRadius: '16px',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[200]
                    : theme.palette.text.primary,
              }}
            />
          )}

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            color="text.secondary"
          >
            <FavoriteBorderIcon fontSize="small" />
            <Typography variant="body2">{total_likes}</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* RIGHT SIDE: Image */}
      <Box
        sx={{
          height: 112,
          aspectRatio: '1 / 1',
          borderRadius: 2,
          overflow: 'hidden',
          flexShrink: 0,
          bgcolor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[200],
        }}
      >
        <img
          src={
            banner_url
              ? banner_url
              : a2zTheme === 'dark'
                ? defaultDarkThumbnail
                : defaultLightThumbnail
          }
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
};

export default BannerProjectCard;
