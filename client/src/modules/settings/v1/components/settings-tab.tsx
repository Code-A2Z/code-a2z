import { Box, ButtonBase, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { ROUTES_V1 } from '../../../../app/routes/constants/routes';
import { SettingTabType } from '../typings';
import A2ZTypography from '../../../../shared/components/atoms/typography';
import { useCustomNavigate } from '../../../../shared/hooks/use-custom-navigate';

const SettingsTab = ({
  setting,
  index,
  filteredSettings,
}: {
  setting: SettingTabType;
  index: number;
  filteredSettings: SettingTabType[];
}) => {
  const theme = useTheme();
  const navigate = useCustomNavigate();
  const { name, description, icon, path, locked, isNew, newText, feature } =
    setting;
  const absolutePath = `${ROUTES_V1.SETTINGS}${path}`;
  const isTabActive = window.location.pathname.includes(absolutePath);
  const isLocked = locked || (feature !== undefined && feature !== '');

  return (
    <ButtonBase<'div'>
      key={index}
      component="div"
      sx={{
        width: '100%',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        rowGap: 0.25,
        borderBottom:
          index < filteredSettings.length - 1
            ? `1px solid ${theme.palette.divider}`
            : 'none',
        bgcolor: isTabActive
          ? theme.palette.mode === 'dark'
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(240, 245, 240, 1)'
          : 'transparent',
        boxShadow: 'none',
        outline: 'none',
        transition: 'background-color 200ms ease-in-out',
        '&:hover': {
          bgcolor: isTabActive
            ? theme.palette.mode === 'dark'
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(240, 245, 240, 0.68)'
            : 'action.hover',
          boxShadow: 'none',
          outline: 'none',
        },
      }}
      onClick={() => {
        if (locked) {
          return;
        }
        navigate({ pathname: absolutePath });
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          columnGap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            columnGap: 1.5,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isTabActive ? 'primary.main' : 'text.secondary',
            }}
          >
            {icon}
            {isLocked && (
              <LockIcon
                sx={{
                  ml: 'auto',
                  height: 15,
                  width: 15,
                  bgcolor: 'background.default',
                  p: 0.25,
                  borderRadius: '50%',
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'absolute',
                  right: -4,
                  top: -6,
                  fontSize: 15,
                  color: 'text.secondary',
                }}
              />
            )}
          </Box>
          <A2ZTypography
            text={name}
            variant="body1"
            props={{
              sx: {
                fontSize: 16,
                fontWeight: 600,
                color: isTabActive ? 'primary.main' : 'text.primary',
              },
              'data-testid': `settings-${name}`,
            }}
          />
        </Box>
        {isNew && (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.5,
              fontSize: 10,
              fontWeight: 600,
              color: 'error.contrastText',
              bgcolor: 'error.main',
              borderRadius: 1.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {newText ?? 'NEW'}
          </Box>
        )}
      </Box>
      {description && (
        <A2ZTypography
          text={description}
          variant="body2"
          props={{
            sx: {
              fontSize: 14,
              fontWeight: 400,
              color: 'text.secondary',
              pl: 'calc(20px + 12px)',
            },
          }}
        />
      )}
    </ButtonBase>
  );
};

export default SettingsTab;
