import { memo, useEffect, useMemo } from 'react';
import { setupTokenRefresh } from './shared/utils/api-interceptor';
import { AppUnProtectedRoutes } from './modules/app/routes';
import { AppProtectedRoutes } from './modules/app/routes/auth-routes';
import useScrollbar from './shared/components/atoms/scrollbar';
import { useAuth } from './shared/hooks/use-auth';

const App = memo(() => {
  const { GlobalScrollbar } = useScrollbar();
  const { token } = useAuth();
  const isAuth = useMemo(() => !!token, [token]);

  useEffect(() => {
    setupTokenRefresh();
  }, []);

  if (!isAuth) {
    return (
      <>
        <GlobalScrollbar />
        <AppUnProtectedRoutes />
      </>
    );
  }

  return (
    <>
      <GlobalScrollbar />
      <AppProtectedRoutes />
    </>
  );
});

export default App;
