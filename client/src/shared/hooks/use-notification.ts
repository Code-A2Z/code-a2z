import { useSetAtom } from 'jotai';
import { notificationsAtom } from '../states/notification';
import { Notification } from '../../infra/rest/typings/notification';

export function useNotifications() {
  const setNotifications = useSetAtom(notificationsAtom);

  const addNotification = (notification: Omit<Notification, 'id' | 'open'>) => {
    const id = Date.now().toString();

    const newNotification: Notification = {
      id,
      open: true,
      autoHideDuration: 3000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.autoHideDuration) {
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, open: false } : n))
        );
        // remove after animation
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 300);
      }, newNotification.autoHideDuration);
    }
  };

  return { addNotification };
}
