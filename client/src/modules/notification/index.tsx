import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { filterPaginationData } from '../../shared/requests/filter-pagination-data';
import Loader from '../../shared/components/atoms/loader';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import LoadMoreDataBtn from '../../shared/components/molecules/load-more-data';
import NotificationCard from './components/notificationCard';
import { notificationFilters } from './constants';
import { useAtom } from 'jotai';
import { UserAtom } from '../../shared/states/user';
import { NotificationData } from '../../shared/typings';

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
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {notificationFilters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                'py-2 ' + (filter === filterName ? 'btn-dark' : 'btn-light')
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications === null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map(
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
            )
          ) : (
            <NoDataMessage message="Nothing available" />
          )}

          <LoadMoreDataBtn
            state={notifications}
            fetchDataFun={fetchNotifications}
            additionalParam={{
              deletedDocCount: notifications.deleteDocCount ?? 0,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
