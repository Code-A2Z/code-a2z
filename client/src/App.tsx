import { memo, useEffect, useMemo } from 'react';
import { setupTokenRefresh } from './shared/utils/api-interceptor';
import { AppUnProtectedRoutes } from './app/routes';
import { AppProtectedRoutes } from './app/routes/auth-routes';
import useScrollbar from './shared/components/atoms/scrollbar';
import { useAuth } from './shared/hooks/use-auth';
import Footer from './components/Footer';

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
        <Footer />
      </>
    );
  }

  return (
    <>
      <GlobalScrollbar />
      <AppProtectedRoutes />
      <Footer />
    </>
  );
});

export default App;
