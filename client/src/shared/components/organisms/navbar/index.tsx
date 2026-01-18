import { AppBar, Toolbar, Box, Badge } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import A2ZIconButton from '../../atoms/icon-button';
import Logo from '../../atoms/logo';
import { useA2ZTheme } from '../../../hooks/use-theme';
import { THEME } from '../../../states/theme';
import { NAVBAR_HEIGHT } from './constants';

const Navbar = () => {
  const { theme, setTheme } = useA2ZTheme();

  return (
    <AppBar
      position="static"
      sx={{
        minHeight: `${NAVBAR_HEIGHT}px`,
        maxHeight: `${NAVBAR_HEIGHT}px`,
        height: `${NAVBAR_HEIGHT}px`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          maxHeight: `${NAVBAR_HEIGHT}px`,
          height: `${NAVBAR_HEIGHT}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Logo />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <A2ZIconButton
            props={{
              onClick: () =>
                setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK),
            }}
          >
            <Badge>
              {theme === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
            </Badge>
          </A2ZIconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
