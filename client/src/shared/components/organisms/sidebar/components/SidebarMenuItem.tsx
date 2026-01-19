import {
  Box,
  ButtonBase,
  Tooltip,
  TooltipProps,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import { FC, MouseEvent, useMemo, useCallback, ElementType } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { ROUTES_PAGE_V1 } from '../../../../../app/routes/constants/routes';
import { useCustomNavigate } from '../../../../hooks/use-custom-navigate';
import { openPopup } from '../../../../utils/popup';
import { useNotifications } from '../../../../hooks/use-notification';
import { NotificationType } from '../../../../states/notification';

const SidebarMenuItem: FC<{
  Icon: ElementType;
  hasAccess?: boolean;
  path?: string;
  title: TooltipProps['title'];
  showExpandedView: boolean;
  onClick?: (event: MouseEvent<Element>) => void;
  style?: SxProps<Theme>;
  component?: () => React.ReactNode | void;
  screenName?: ROUTES_PAGE_V1;
  hideRipple?: boolean;
  hide?: boolean;
}> = ({
  Icon,
  title,
  path,
  hasAccess,
  onClick,
  showExpandedView = false,
  style,
  component,
  screenName,
  hideRipple,
  hide,
}) => {
  const navigate = useCustomNavigate();
  const theme = useTheme();
  const { addNotification } = useNotifications();

  const getCurrentPage = useCallback(() => {
    if (!path || !screenName) return false;
    if (window.location.pathname === '/' && path === '/') {
      return true;
    }
    if (path.includes(screenName) && window.location.pathname.includes(path)) {
      return true;
    }
    return false;
  }, [path, screenName]);

  const isCurrentPage = useMemo(() => getCurrentPage(), [getCurrentPage]);

  const iconColorValue = useMemo(() => {
    if (isCurrentPage) {
      return theme.palette.primary.main;
    }
    return showExpandedView
      ? theme.palette.text.primary
      : theme.palette.text.secondary;
  }, [
    isCurrentPage,
    showExpandedView,
    theme.palette.primary.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  const bgColor = useMemo(
    () => (isCurrentPage ? theme.palette.action.selected : 'transparent'),
    [isCurrentPage, theme.palette.action.selected]
  );

  const isLocked = typeof hasAccess !== 'undefined' && !hasAccess;

  const lockIcon = isLocked ? (
    <LockIcon
      sx={{
        marginLeft: 'auto',
        height: '15px !important',
        width: '15px !important',
        bgcolor: 'background.default',
        padding: '2px',
        borderRadius: '50%',
        border: 1,
        borderColor: 'divider',
        position: 'absolute',
        right: '-2px',
        top: '-6px',
        fontSize: 18,
      }}
    />
  ) : null;

  const content = useMemo(() => {
    if (typeof component === 'function') {
      const componentResult = component();
      return componentResult || null;
    }
    return (
      <Box
        component="h2"
        sx={{
          flex: '1 1 0',
          alignSelf: 'center',
          fontSize: '14px',
          margin: 0,
          marginLeft: '10px',
          color: iconColorValue,
          fontWeight: 500,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Box>
    );
  }, [component, title, iconColorValue]);

  const handleClick = useCallback(
    (event: MouseEvent<Element>) => {
      if (isLocked && !onClick) {
        return addNotification({
          message: 'Coming soon',
          type: NotificationType.INFO,
        });
      }

      if (path) {
        if (
          event.ctrlKey ||
          event.shiftKey ||
          event.metaKey || // apple
          (event.button && event.button === 1) // middle click, >IE9 + everyone else
        ) {
          openPopup(path, '_blank');
        } else {
          navigate({ pathname: path }, { clearExistingParams: true });
        }
      } else {
        onClick?.(event);
      }
    },
    [isLocked, onClick, path, navigate, addNotification]
  );

  if (hide) return null;

  return (
    <Tooltip
      sx={{
        marginLeft: '6px !important',
      }}
      title={!showExpandedView ? title : ''}
      arrow
      placement="right"
    >
      <ButtonBase
        onClick={handleClick}
        disableRipple={!showExpandedView || hideRipple}
        component="div"
        sx={{
          width: '100%',
          padding: typeof component === 'function' ? '0px 14px' : '8px 14px',
          fontWeight: 600,
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',
          cursor: !isLocked && !hideRipple ? 'pointer' : 'default',
          bgcolor: bgColor,
          height: '40px',
          transition: 'background-color 200ms ease-in-out',
          ...(!hideRipple && {
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }),
          ...(style || {}),
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            width: '28px',
            height: '28px',
            padding: '3px',
            color: iconColorValue,
            transition: 'all 280ms ease-in-out',
            '& svg': {
              width: '100%',
              height: '100%',
              color: 'inherit',
            },
          }}
        >
          <Icon />
          {lockIcon}
        </Box>

        {content}
      </ButtonBase>
    </Tooltip>
  );
};

export default SidebarMenuItem;
