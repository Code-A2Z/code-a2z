import { Box } from '@mui/material';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';
import InputBox from '../../../../../../shared/components/atoms/input-box';
import { SOCIAL_LINKS_CONFIG } from '../constants';
import { SocialLinkInputProps } from '../typings';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

const socialIcons: Record<string, React.ReactNode> = {
  youtube: <YouTubeIcon />,
  facebook: <FacebookIcon />,
  x: <TwitterIcon />,
  github: <GitHubIcon />,
  instagram: <InstagramIcon />,
  website: <LanguageIcon />,
};

const SocialLinkInput = ({ formData, onChange }: SocialLinkInputProps) => {
  return (
    <Box>
      <A2ZTypography
        text="Add your social handles below"
        variant="subtitle2"
        props={{
          sx: {
            mb: 2,
            color: 'text.secondary',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {SOCIAL_LINKS_CONFIG.map(({ key, placeholder }) => {
          const fieldValue = formData[key as keyof typeof formData] || '';
          return (
            <InputBox
              key={key}
              id={`edit-profile-${key}`}
              name={key}
              type="text"
              value={fieldValue}
              placeholder={placeholder}
              icon={socialIcons[key] || <LanguageIcon />}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
              }}
              slotProps={{
                htmlInput: {
                  onChange,
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SocialLinkInput;
