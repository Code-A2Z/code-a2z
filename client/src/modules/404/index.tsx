import { Box, Typography, Link as MUILink, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 4, md: 10 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="img"
        src="/404.png"
        alt="404 Page Not Found"
        sx={{
          width: { xs: '90%', sm: 600 },
          aspectRatio: '16 / 9',
          borderRadius: 3,
          border: `2px solid ${theme.palette.divider}`,
          objectFit: 'cover',
          userSelect: 'none',
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Gelasio', serif",
          color: theme.palette.text.primary,
          lineHeight: 1.4,
        }}
      >
        Page not found
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '1.25rem',
          lineHeight: 1.7,
          mt: -2,
          maxWidth: 600,
        }}
      >
        The page you are looking for does not exist. Head back to the{' '}
        <MUILink
          component={Link}
          to="/"
          underline="always"
          sx={{ color: theme.palette.text.primary, fontWeight: 500 }}
        >
          home page
        </MUILink>
        .
      </Typography>

      <Box sx={{ mt: 'auto', textAlign: 'center' }}>
        <Box
          component="img"
          src="/full-logo.png"
          alt="Logo"
          sx={{
            height: 64,
            borderRadius: 2,
            border: `2px solid ${theme.palette.divider}`,
            userSelect: 'none',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: theme.palette.text.secondary,
          }}
        >
          Read millions of project scripts around the world.
        </Typography>
      </Box>
    </Box>
  );
};

export default PageNotFound;
