import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAtom } from 'jotai';
import { resolvedThemeAtom } from '../states/theme';
import getMuiTheme from './mui';

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resolved] = useAtom(resolvedThemeAtom);

  const theme = getMuiTheme(resolved === 'dark' ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
