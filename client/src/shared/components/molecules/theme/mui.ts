import { createTheme, type ThemeOptions } from '@mui/material/styles';

const LIGHT_MODE_THEME = {
  primary: { main: '#2563eb', contrastText: '#ffffff' }, // refined blue accent
  secondary: { main: '#6366f1', contrastText: '#ffffff' }, // indigo tone for secondary actions
  error: { main: '#dc2626' },
  warning: { main: '#f59e0b' },
  info: { main: '#0ea5e9' },
  success: { main: '#16a34a' },

  background: {
    default: '#f9fafb', // very light neutral gray
    paper: '#ffffff', // clean white surfaces
  },
  text: {
    primary: '#111827', // dark gray for readability
    secondary: '#6b7280', // muted gray for subtext
  },
  divider: '#e5e7eb',
};

const DARK_MODE_THEME = {
  primary: { main: '#3b82f6', contrastText: '#ffffff' }, // same hue for continuity
  secondary: { main: '#818cf8', contrastText: '#ffffff' }, // soft indigo accent
  error: { main: '#f87171' },
  warning: { main: '#fbbf24' },
  info: { main: '#38bdf8' },
  success: { main: '#22c55e' },

  background: {
    default: '#0f1115', // deep gray with blue undertone (not pure black)
    paper: '#181b20', // slightly lifted surface tone
  },
  text: {
    primary: '#f3f4f6', // clean white-gray text
    secondary: '#9ca3af', // soft muted gray for paragraphs
  },
  divider: '#27272a',
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
