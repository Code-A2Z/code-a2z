import { memo, useEffect, useState, useMemo } from 'react';
import { Provider } from 'jotai';
import { setupTokenRefresh } from './shared/utils/api-interceptor';
import { AppUnProtectedRoutes } from './modules/app/routes';
import { AppProtectedRoutes } from './modules/app/routes/auth-routes';
import useScrollbar from './shared/components/atoms/scrollbar';
import { useAuth } from './shared/hooks/use-auth';

const App = memo(() => {
  const { GlobalScrollbar } = useScrollbar();
  const [cacheKey, setCacheKey] = useState<string>('');
  const { token } = useAuth();
  const isAuth = useMemo(() => !!token, [token]);

  useEffect(() => {
    setupTokenRefresh();
  }, []);

  useEffect(() => {
    setCacheKey(Date.now().toString());
  }, [isAuth]);

  if (!isAuth) {
    return (
      <>
        <GlobalScrollbar />
        <AppUnProtectedRoutes />
      </>
    );
  }

  return (
    <Provider key={cacheKey}>
      <GlobalScrollbar />
      <AppProtectedRoutes />
    </Provider>
  );
});

export default App;
