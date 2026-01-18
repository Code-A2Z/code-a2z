import { useRef, useState } from 'react';
import { useNotifications } from '../../../../shared/hooks/use-notification';
import { emailRegex } from '../../../../shared/utils/regex';
import { subscribeUser } from '../../../../infra/rest/apis/subscriber';

export const useSubscribe = () => {
  const { addNotification } = useNotifications();
  const subscribeEmailRef = useRef<HTMLInputElement>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);

  const handleSubscribe = async () => {
    const email = subscribeEmailRef.current?.value || '';
    if (!email.trim().length) {
      addNotification({
        message: 'Email is required',
        type: 'error',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      addNotification({
        message: 'Please enter a valid email',
        type: 'error',
      });
      return;
    }

    const response = await subscribeUser(email);
    addNotification({
      message: response.message,
      type: response.status,
    });
    setShowSubscribeModal(false);
  };

  return {
    subscribeEmailRef,
    showSubscribeModal,
    setShowSubscribeModal,
    handleSubscribe,
  };
};
