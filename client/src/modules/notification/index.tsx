import { useEffect, useState,useRef,useCallback } from 'react';
import NotificationCard from './components/notificationCard';
import { notificationFilters } from './constants';
import { useSetAtom } from 'jotai';
import { NotificationsAtom } from './states';
import useNotifications from './hooks';
import { useAuth } from '../../shared/hooks/use-auth';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  List,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Favorite,
  Comment,
  Reply,
} from '@mui/icons-material';
import { NOTIFICATION_FILTER_TYPE } from '../../infra/rest/typings';

const Notifications = () => {
  const prevFilterRef = useRef<NOTIFICATION_FILTER_TYPE | null>(null);
  const setNotifications = useSetAtom(NotificationsAtom);
  const [filter, setFilter] = useState<NOTIFICATION_FILTER_TYPE>(
    NOTIFICATION_FILTER_TYPE.ALL
  );
  const { fetchNotifications, notifications } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);


  // Avoid refetching notifications when the same filter is selected again
  useEffect(() => {
    if (!isAuthenticated()) return;
    if (prevFilterRef.current === filter && notifications !== null) {
      return;
    }
    prevFilterRef.current = filter;
    setIsFilterLoading(true);
    setNotifications(null);
    fetchNotifications({
      page: 1,
      filter,
      deletedDocCount: 0, 
    }).finally(() => {
      setIsFilterLoading(false);
});

  }, [filter, isAuthenticated, fetchNotifications, notifications, setNotifications]);


  const handleFilter = useCallback((filterName: string) => {
    setFilter(filterName as NOTIFICATION_FILTER_TYPE);
  }, []);


  const handleLoadMore = async () => {
    if (
      !notifications ||
      isLoadingMore ||
      notifications.results.length >= notifications.totalDocs
    ) {
      return;
    }

    try {
      setIsLoadingMore(true);
      await fetchNotifications({
        page: notifications.page + 1,
        filter,
        deletedDocCount: notifications.deleteDocCount || 0,
      });
    } 
    
    finally {
      setIsLoadingMore(false);
    }
  };


  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay updated with your latest activity and interactions
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <ButtonGroup
          variant="outlined"
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiButtonGroup-grouped': {
              borderRadius: '24px !important',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.5,
            },
          }}
        >
          {notificationFilters.map((filterName, i) => {
            const isActive = filter === filterName;
            return (
              <Button
                key={i}
                variant={isActive ? 'contained' : 'outlined'}
                color={isActive ? 'primary' : 'inherit'}
                onClick={() => handleFilter(filterName)}
                disabled={isFilterLoading}
                startIcon={
                  filterName === 'all' ? (
                    <NotificationsIcon />
                  ) : filterName === 'like' ? (
                    <Favorite />
                  ) : filterName === 'comment' ? (
                    <Comment />
                  ) : filterName === 'reply' ? (
                    <Reply />
                  ) : (
                    <NotificationsIcon />
                  )
                }
                sx={{
                  borderRadius: '24px',
                  textTransform: 'capitalize',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  ...(isActive && {
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                  }),
                }}
              >
                {filterName}
              </Button>
            );
          })}
        </ButtonGroup>
      </Box>

      {notifications === null ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifications.results.length ? (
            <List sx={{ width: '100%' }}>
              {notifications.results.map((notification, i) => (
                <NotificationCard
                  key={notification._id || i}
                  data={notification}
                  index={i}
                  notificationState={{
                    notifications: notifications,
                    setNotifications: setNotifications,
                  }}
                />
              ))}
            </List>
          ) : (
            <Alert
              severity="info"
              icon={<NotificationsIcon />}
              sx={{
                textAlign: 'center',
                py: 4,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                No notifications yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filter === NOTIFICATION_FILTER_TYPE.ALL
                  ? "You're all caught up! Check back later for new notifications."
                  : `No ${filter} notifications found.`}
              </Typography>
            </Alert>
          )}

          {notifications.results.length > 0 &&
            notifications.results.length < notifications.totalDocs && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={handleLoadMore}
                  variant="outlined"
                  size="medium"
                  disabled={isLoadingMore}
                  startIcon={
                    isLoadingMore ? <CircularProgress size={16} /> : null
                  }
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
        </>
      )}
    </Box>
  );
};

export default Notifications;
