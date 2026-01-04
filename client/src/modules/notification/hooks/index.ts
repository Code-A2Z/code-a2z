import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  getNotifications,
  allNotificationCounts,
} from '../../../infra/rest/apis/notification';
import { NotificationsAtom, NotificationPaginationState } from '../states';
import { useAuth } from '../../../shared/hooks/use-auth';
import { NOTIFICATION_FILTER_TYPE } from '../../../infra/rest/typings';

const useNotifications = () => {
  const setNotifications = useSetAtom(NotificationsAtom);
  const notifications = useAtomValue(NotificationsAtom);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(
    async (params: {
      page: number;
      filter: NOTIFICATION_FILTER_TYPE;
      deletedDocCount?: number;
    }) => {
      if (!isAuthenticated()) return;

      const { page, filter, deletedDocCount = 0 } = params;

      try {
        const [notificationsResponse, countResponse] = await Promise.all([
          getNotifications({ page, filter, deletedDocCount }),
          allNotificationCounts({ filter }),
        ]);

        if (notificationsResponse.data && countResponse.data) {
          setNotifications((currentState) => {
            const existingResults = currentState?.results || [];

            const formattedData: NotificationPaginationState = {
              results:
                page === 1
                  ? notificationsResponse.data
                  : [...existingResults, ...notificationsResponse.data],
              page,
              totalDocs: countResponse.data.totalDocs || 0,
              deleteDocCount: deletedDocCount,
            };

            return formattedData;
          });
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    [isAuthenticated, setNotifications]
  );

  return {
    fetchNotifications,
    notifications,
  };
};

export default useNotifications;
