import React from 'react';
import { useAtom } from 'jotai';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ResolvedThemeAtom, THEME } from '../../../states/theme';
import getMuiTheme from './mui';

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resolved] = useAtom(ResolvedThemeAtom);
  const theme = getMuiTheme(resolved === THEME.DARK ? THEME.DARK : THEME.LIGHT);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
