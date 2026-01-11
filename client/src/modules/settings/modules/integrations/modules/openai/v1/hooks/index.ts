import { useState, useCallback } from 'react';
import { useNotifications } from '../../../../../../../../shared/hooks/use-notification';

const useOpenAIIntegrationV1 = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement the logic to connect to OpenAI
      setIsConnected(true);
      addNotification({
        message: 'Successfully connected to OpenAI',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addNotification({
        message: 'Failed to connect to OpenAI. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const handleDisconnect = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement the logic to disconnect from OpenAI
      setIsConnected(false);
      setApiKey('');
      addNotification({
        message: 'Successfully disconnected from OpenAI',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addNotification({
        message: 'Failed to disconnect from OpenAI. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  return {
    apiKey,
    setApiKey,
    isConnected,
    loading,
    handleConnect,
    handleDisconnect,
  };
};

export default useOpenAIIntegrationV1;
