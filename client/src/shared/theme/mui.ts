import { createTheme, type ThemeOptions } from '@mui/material/styles';

const LIGHT_MODE_THEME = {
  primary: { main: '#2563eb', contrastText: '#ffffff' },
  secondary: { main: '#7c3aed', contrastText: '#ffffff' },
  error: { main: '#dc2626' },
  warning: { main: '#f59e0b' },
  info: { main: '#0284c7' },
  success: { main: '#16a34a' },

  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
  },
};

const DARK_MODE_THEME = {
  primary: { main: '#3b82f6', contrastText: '#ffffff' },
  secondary: { main: '#8b5cf6', contrastText: '#ffffff' },
  error: { main: '#f87171' },
  warning: { main: '#fbbf24' },
  info: { main: '#38bdf8' },
  success: { main: '#22c55e' },

  background: {
    default: '#18181b',
    paper: '#1f1f23',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#9ca3af',
  },
};

export const getMuiTheme = (mode: 'light' | 'dark') => {
  const base: ThemeOptions = {
    palette: {
      mode,
      ...(mode === 'light' ? LIGHT_MODE_THEME : DARK_MODE_THEME),
    },
    typography: {
      fontFamily: ['Inter', 'Gelasio', 'sans-serif'].join(', '),
      h1: { fontWeight: 700, fontSize: '2.25rem' },
      h2: { fontWeight: 600, fontSize: '1.875rem' },
      h3: { fontWeight: 600, fontSize: '1.5rem' },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    },
  };

  return createTheme(base);
};

export default getMuiTheme;
