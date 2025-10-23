import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const CategoryButton = styled(Button)(({ theme }) => ({
  textTransform: 'lowercase',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.75, 2),
  fontSize: '0.875rem',
  fontWeight: 500,
  border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]}`,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[100],
    borderColor: theme.palette.primary.main,
  },

  '&.active': {
    backgroundColor: theme.palette.mode === 'dark' ? '#18181b' : '#f0f0f0',
    color: theme.palette.mode === 'dark' ? '#a3a3a3' : '#444444',
    borderColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[400],
  },
}));
