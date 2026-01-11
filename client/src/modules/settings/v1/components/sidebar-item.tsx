import { Box, ButtonBase, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import A2ZTypography from '../../../../shared/components/atoms/typography';
import { useCustomNavigate } from '../../../../shared/hooks/use-custom-navigate';

interface SidebarItemProps {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
  path: string;
  locked?: boolean;
  isNew?: boolean;
  newText?: string;
  feature?: string;
  isActive: boolean;
  isLastItem: boolean;
  testId?: string;
}

const SidebarItem = ({
  name,
  description,
  icon,
  path,
  locked = false,
  isNew = false,
  newText,
  feature,
  isActive,
  isLastItem,
  testId,
}: SidebarItemProps) => {
  const theme = useTheme();
  const navigate = useCustomNavigate();
  const isLocked = locked || (feature !== undefined && feature !== '');

  return (
    <ButtonBase<'div'>
      component="div"
      sx={{
        width: '100%',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        rowGap: 0.25,
        borderBottom: isLastItem ? 'none' : `1px solid ${theme.palette.divider}`,
        bgcolor: isActive
          ? theme.palette.mode === 'dark'
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(240, 245, 240, 1)'
          : 'transparent',
        boxShadow: 'none',
        outline: 'none',
        transition: 'background-color 200ms ease-in-out',
        '&:hover': {
          bgcolor: isActive
            ? theme.palette.mode === 'dark'
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(240, 245, 240, 0.68)'
            : 'action.hover',
          boxShadow: 'none',
          outline: 'none',
        },
      }}
      disabled={isLocked}
      onClick={() => {
        if (isLocked) {
          return;
        }
        navigate({ pathname: path });
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
              color: isActive ? 'primary.main' : 'text.secondary',
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
                color: isActive ? 'primary.main' : 'text.primary',
              },
              'data-testid': testId,
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
              pl: 4,
            },
          }}
        />
      )}
    </ButtonBase>
  );
};

export default SidebarItem;
