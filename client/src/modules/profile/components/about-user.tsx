// TODO: Improve UI/UX of this component
import { Box, Typography, Stack, useTheme, Link } from '@mui/material';
import { getFullDay } from '../../../shared/utils/date';
import { USER_SOCIAL_LINKS } from '../../../infra/rest/typings';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import A2ZIconButton from '../../../shared/components/atoms/icon-button';

const socialIcons = {
  facebook: <FacebookIcon />,
  x: <XIcon />,
  github: <GitHubIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  youtube: <YouTubeIcon />,
  website: <LanguageIcon />,
};

interface AboutUserProps {
  bio: string;
  social_links: USER_SOCIAL_LINKS;
  joinedAt: string;
}

const AboutUser = ({ bio, social_links, joinedAt }: AboutUserProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: { md: '90%' },
        mt: { md: 7 },
      }}
    >
      {/* Bio */}
      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        {bio?.length ? bio : 'Nothing to read here'}
      </Typography>

      {/* Social Links */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        spacing={2}
        sx={{
          my: 3,
          color: theme.palette.text.secondary,
        }}
      >
        {Object.entries(social_links).map(([key, link]) =>
          link ? (
            <Link
              key={key}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <A2ZIconButton
                props={{
                  sx: {
                    color: theme.palette.text.secondary,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.text.primary
                          : theme.palette.common.white,
                    },
                  },
                }}
              >
                {socialIcons[key as keyof typeof socialIcons]}
              </A2ZIconButton>
            </Link>
          ) : null
        )}
      </Stack>

      {/* Join Date */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
      >
        Joined on {getFullDay(joinedAt)}
      </Typography>
    </Box>
  );
};

export default AboutUser;
