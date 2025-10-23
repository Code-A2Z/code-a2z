import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { filterPaginationData } from '../../shared/requests/filter-pagination-data';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import LoadMoreDataBtn from '../../shared/components/molecules/load-more-data';
import NotificationCard from './components/notificationCard';
import { notificationFilters } from './constants';
import { useAtom } from 'jotai';
import { UserAtom } from '../../shared/states/user';
import { NotificationData } from '../../infra/rest/typings';
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

interface PaginationState<T = unknown> {
  results: T[];
  page: number;
  totalDocs: number;
}

type NotificationPaginationState = PaginationState<NotificationData> & {
  deleteDocCount?: number;
};

const Notifications = () => {
  const [user, setUser] = useAtom(UserAtom);

  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] =
    useState<NotificationPaginationState | null>(null);

  const fetchNotifications = useCallback(
    (params: Record<string, unknown>) => {
      const { page, deletedDocCount = 0 } = params;

      if (!user.access_token || typeof page !== 'number') return;

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + '/api/notification/get',
          { page, filter, deletedDocCount },
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        )
        .then(
          async ({
            data: { notifications: data },
          }: {
            data: { notifications: NotificationData[] };
          }) => {
            if (user.new_notification_available) {
              setUser(prev => ({ ...prev, new_notification_available: false }));
            }

            const formattedData = await filterPaginationData({
              state: notifications,
              data,
              page,
              countRoute: '/api/notification/all-count',
              data_to_send: { filter },
            });

            setNotifications(formattedData as NotificationPaginationState);
          }
        )
        .catch((err: unknown) => {
          console.log(err);
        });
    },
    [
      user.access_token,
      filter,
      notifications,
      user.new_notification_available,
      setUser,
    ]
  );

  useEffect(() => {
    if (user.access_token) {
      fetchNotifications({ page: 1 });
    }
  }, [user.access_token, filter, fetchNotifications]);

  const handleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.target as HTMLButtonElement;
    setFilter(btn.innerHTML.toLowerCase());
    setNotifications(null);
  };

  return (
    <Box sx={{ maxWidth: '4xl', mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
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
                onClick={handleFilter}
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
              {notifications.results.map(
                (notification: NotificationData, i: number) => {
                  return (
                    <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                      <NotificationCard
                        data={notification}
                        index={i}
                        notificationState={{
                          notifications: notifications,
                          setNotifications: (
                            newState: NotificationPaginationState
                          ) => setNotifications(newState),
                        }}
                      />
                    </AnimationWrapper>
                  );
                }
              )}
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
                {filter === 'all'
                  ? "You're all caught up! Check back later for new notifications."
                  : `No ${filter} notifications found.`}
              </Typography>
            </Alert>
          )}

          {notifications.results.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <LoadMoreDataBtn
                state={notifications}
                fetchDataFun={fetchNotifications}
                additionalParam={{
                  deletedDocCount: notifications.deleteDocCount ?? 0,
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Notifications;
