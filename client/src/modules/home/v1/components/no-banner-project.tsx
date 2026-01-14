import { Link } from 'react-router-dom';
import { Avatar, Box, Stack, useTheme } from '@mui/material';
import { getTrendingProjectsResponse } from '../../../../infra/rest/apis/project/typing';
import { getDay } from '../../../../shared/utils/date';
import A2ZTypography from '../../../../shared/components/atoms/typography';
import { ROUTES_V1 } from '../../../../app/routes/constants/routes';

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
      to={`${ROUTES_V1.HOME}/${_id}`}
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
      <A2ZTypography
        variant="h5"
        text={index < 10 ? `0${index + 1}` : String(index + 1)}
        props={{
          sx: {
            fontWeight: 600,
            minWidth: 40,
            textAlign: 'center',
            color: 'text.secondary',
          },
        }}
      />

      {/* Main Content */}
      <Box>
        {/* Author Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Avatar
            src={profile_img}
            alt={fullname}
            sx={{ width: 24, height: 24 }}
          />
          <A2ZTypography
            variant="body2"
            text={`${fullname} @${username}`}
            noWrap
            props={{
              sx: {
                maxWidth: 160,
                color: 'text.primary',
              },
            }}
          />
          <A2ZTypography
            variant="caption"
            text={getDay(publishedAt)}
            props={{
              sx: {
                minWidth: 'fit-content',
                color: 'text.secondary',
              },
            }}
          />
        </Stack>

        {/* Project Title */}
        <A2ZTypography
          variant="h6"
          text={title}
          props={{
            className: 'project-title',
            sx: {
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'text.primary',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default NoBannerProjectCard;
