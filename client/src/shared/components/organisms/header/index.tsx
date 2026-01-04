import { AppBar, Toolbar, Box, Badge } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import A2ZIconButton from '../../atoms/icon-button';
import Logo from '../../atoms/logo';
import { useA2ZTheme } from '../../../hooks/use-theme';
import { THEME } from '../../../states/theme';
import { HEADER_HEIGHT } from './constants';

const Header = () => {
  const { theme, setTheme } = useA2ZTheme();

  return (
    <AppBar
      position="static"
      sx={{
        minHeight: `${HEADER_HEIGHT}px`,
        maxHeight: `${HEADER_HEIGHT}px`,
        height: `${HEADER_HEIGHT}px`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${HEADER_HEIGHT}px !important`,
          maxHeight: `${HEADER_HEIGHT}px`,
          height: `${HEADER_HEIGHT}px`,
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
          <A2ZIconButton>
            <Badge
              onClick={() =>
                setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK)
              }
            >
              {theme === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
            </Badge>
          </A2ZIconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
