import { useSetAtom, useAtom } from 'jotai';
import { useEffect, useState, useCallback } from 'react';
import { UserAtom } from '../../infra/states/user';
import { TokenAtom } from '../../infra/states/auth';
import { refreshToken } from '../../infra/rest/apis/auth';
import {
  getAccessToken,
  removeFromLocal,
  setAccessToken,
} from '../utils/local';
import { TOKEN_CONFIG } from '../../config/env';

export const useAuth = () => {
  const [token, setToken] = useAtom(TokenAtom);
  const setUser = useSetAtom(UserAtom);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize tokens from localStorage on app start
  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      setToken(accessToken);
    }
    // Mark auth as initialized after syncing from storage so components can wait
    setInitialized(true);
  }, [setToken]);

  // Sync tokens with localStorage when they change (for local state management)
  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);

  const clearToken = (): void => {
    removeFromLocal(TOKEN_CONFIG.ACCESS_TOKEN_NAME);
    setToken(null);
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearToken();
  }, [setToken, setUser]);

  const login = (accessToken: string) => {
    setToken(accessToken);
  };

  // Listen for token refresh events from api-interceptor
  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent) => {
      const newToken = event.detail?.token;
      if (newToken) {
        setToken(newToken);
      }
    };

    const handleTokenRefreshFailed = () => {
      logout();
    };

    window.addEventListener(
      'token-refreshed',
      handleTokenRefreshed as EventListener
    );
    window.addEventListener('token-refresh-failed', handleTokenRefreshFailed);

    return () => {
      window.removeEventListener(
        'token-refreshed',
        handleTokenRefreshed as EventListener
      );
      window.removeEventListener(
        'token-refresh-failed',
        handleTokenRefreshFailed
      );
    };
  }, [setToken, logout]);

  const refreshAuthToken = async (): Promise<boolean> => {
    // Check localStorage first, as it might have been updated by interceptor
    const storedToken = getAccessToken();
    if (!token && !storedToken) {
      logout();
      return false;
    }

    try {
      const response = await refreshToken();
      if (response.status === 'success') {
        if (response?.data?.access_token) {
          const newToken = response.data.access_token;
          setAccessToken(newToken);
          setToken(newToken);
          return true;
        }
        logout();
        return false;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't logout immediately on error - let the interceptor handle it
      // Only logout if we definitely don't have a token
      const currentToken = getAccessToken();
      if (!currentToken) {
        logout();
      }
      return false;
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  return {
    token,
    setToken,
    clearToken,
    login,
    logout,
    refreshAuthToken,
    isAuthenticated,
    getAuthHeaders,
    initialized,
  };
};
