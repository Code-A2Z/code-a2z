import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import A2ZTypography from '../typography';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
      }}
      onClick={() => navigate('/')}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="Logo"
        sx={{
          height: { xs: 32, sm: 36, md: 40 },
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '8px',
        }}
      />
      <A2ZTypography
        variant="h6"
        noWrap
        props={{
          sx: {
            display: { xs: 'none', sm: 'block' },
            fontSize: '20px',
            fontWeight: 650,
          },
        }}
        text="Code A2Z"
      />
    </Box>
  );
};

export default Logo;
