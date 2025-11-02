import { Box, useTheme } from '@mui/material';
import A2ZTypography from '../typography';

const NoDataMessageBox = ({ message }: { message: string }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        width: '100%',
        p: 2,
        borderRadius: '9999px',
        bgcolor:
          theme.palette.mode === 'dark' ? '#1a1a1a' : theme.palette.grey[50],
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        mt: 2,
      }}
    >
      <A2ZTypography variant="body1" text={message} />
    </Box>
  );
};

export default NoDataMessageBox;
