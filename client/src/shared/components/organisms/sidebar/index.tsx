import { Box, Typography, SxProps, Theme, ButtonBase } from '@mui/material';
import { ORGANISATION_TITLE_HEIGHT, SIDEBAR_WIDTH } from './constants';
import useSidebar from './hooks';
import SidebarMenuItem from './components/SidebarMenuItem';
import { appVersion, ORGANISATION_NAME } from '../../../../config/env';
import A2ZTypography from '../../atoms/typography';
import ProfileAvatar from '../../molecules/profile-avatar';

const Sidebar = () => {
  const {
    showExpandedView,
    handleMouseHoverIn,
    handleMouseHoverOut,
    sidebarItems,
  } = useSidebar();
  const { items, secondaryItems } = sidebarItems;

  return (
    <Box
      onMouseEnter={handleMouseHoverIn}
      onMouseLeave={handleMouseHoverOut}
      sx={{
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        flexGrow: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        height: '100%',
        top: 0,
        zIndex: 3,
        left: 0,
        width: showExpandedView ? '230px' : `${SIDEBAR_WIDTH}px`,
        minWidth: showExpandedView ? '230px' : `${SIDEBAR_WIDTH}px`,
        maxWidth: showExpandedView ? '230px' : `${SIDEBAR_WIDTH}px`,
        transition:
          'width 280ms ease-in-out, min-width 280ms ease-in-out, max-width 280ms ease-in-out',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          height: `${ORGANISATION_TITLE_HEIGHT}px`,
          minHeight: `${ORGANISATION_TITLE_HEIGHT}px`,
          width: '100%',
          overflow: showExpandedView ? 'auto' : 'hidden',
          transition: 'all 280ms ease-in-out',
          flex: '0 1 auto',
        }}
      >
        <ButtonBase
          component="div"
          sx={{
            height: `${ORGANISATION_TITLE_HEIGHT}px`,
            width: '100%',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: showExpandedView ? 'space-between' : 'center',
            textAlign: 'left',
            margin: 0,
            cursor: 'pointer',
            padding: showExpandedView ? '0px 8px 0px 16px' : '0px 8px',
            borderBottom: 1,
            borderColor: 'divider',
            transition: 'background-color 200ms ease-in-out',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {showExpandedView ? (
            <A2ZTypography
              text={ORGANISATION_NAME}
              props={{
                sx: {
                  fontWeight: 600,
                  width: 'calc(100% - 28px)',
                  paddingRight: '12px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word',
                  wordBreak: 'break-all',
                  color: 'text.primary',
                },
              }}
            />
          ) : (
            <ProfileAvatar
              name={ORGANISATION_NAME}
              styles={{
                width: 36,
                height: 36,
                margin: 0,
              }}
            />
          )}
        </ButtonBase>
      </Box>

      <Box
        sx={{
          width: '100%',
          flex: '1 1 auto',
          transition: 'all 280ms ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
            scrollbarGutter: 'stable',
          },
        }}
      >
        {items.map(
          (
            {
              icon,
              path,
              onClick,
              title,
              style,
              component,
              screenName,
              hasAccess,
              hideRipple,
              hide,
            },
            index
          ) => {
            return (
              <SidebarMenuItem
                key={index}
                Icon={icon}
                title={title}
                path={path}
                showExpandedView={showExpandedView}
                onClick={onClick}
                hasAccess={hasAccess}
                style={style as SxProps<Theme>}
                component={component}
                screenName={screenName}
                hideRipple={hideRipple}
                hide={hide}
              />
            );
          }
        )}
      </Box>

      <Box
        sx={{
          width: '100%',
          flex: '0 1 auto',
        }}
      >
        {secondaryItems.map(
          (
            {
              icon,
              path,
              onClick,
              title,
              style,
              component,
              screenName,
              hasAccess,
              hideRipple,
            },
            index
          ) => {
            return (
              <SidebarMenuItem
                key={index}
                Icon={icon}
                title={title}
                path={path}
                showExpandedView={showExpandedView}
                onClick={onClick}
                hasAccess={hasAccess}
                style={style as SxProps<Theme>}
                component={component}
                screenName={screenName}
                hideRipple={hideRipple}
              />
            );
          }
        )}
      </Box>

      {appVersion && (
        <Box
          sx={{
            padding: showExpandedView ? '8px 16px' : '8px 0px',
            fontSize: '12px',
            fontWeight: 600,
            height: '34px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            opacity: showExpandedView ? 1 : 0,
            whiteSpace: 'nowrap',
            flex: '0 1 auto',
            transition: 'all 280ms ease-in-out',
            color: 'text.secondary',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'text.secondary',
              textAlign: showExpandedView ? 'left' : 'center',
              width: '100%',
            }}
          >
            {showExpandedView ? `APP VERSION: ${appVersion}` : appVersion}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
