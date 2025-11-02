import { useSetAtom } from 'jotai';
import { NotificationSystemAtom } from '../states/notification';
import { NotificationSystem } from '../states/notification';

export function useNotifications() {
  const setNotifications = useSetAtom(NotificationSystemAtom);

  const addNotification = (
    notification: Omit<NotificationSystem, 'id' | 'open'>
  ) => {
    const id = Date.now().toString();

    const newNotification: NotificationSystem = {
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
