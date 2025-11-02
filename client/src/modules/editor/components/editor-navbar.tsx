import { AppBar, Toolbar, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import A2ZTypography from '../../../shared/components/atoms/typography';
import A2ZButton from '../../../shared/components/atoms/button';

const EditorNavbar = ({
  title,
  onSaveDraft,
  onPublish,
}: {
  title?: string;
  onSaveDraft: () => void;
  onPublish: () => void;
}) => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            flexShrink: 0,
            width: 40,
          }}
        >
          <ArrowBackIcon
            sx={{
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
              fontSize: 32,
            }}
          />
        </Box>

        <A2ZTypography
          variant="body1"
          noWrap
          text={title?.length ? title : 'New Project'}
        />

        <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
          <A2ZButton
            variant="contained"
            color="primary"
            size="medium"
            onClick={onPublish}
          >
            Publish
          </A2ZButton>

          <A2ZButton variant="outlined" size="medium" onClick={onSaveDraft}>
            Save Draft
          </A2ZButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default EditorNavbar;
