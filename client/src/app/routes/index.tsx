import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../../shared/components/molecules/loader';
import { LOADING } from './constants';
import { LoginLazyComponent } from '../components';

// Add lazy loading for ResetPassword component
const ResetPasswordLazyComponent = lazy(
  () => import('../../modules/auth/v1/reset-password')
);

export function AppUnProtectedRoutes() {
  return (
    <Routes>
      <Route
        path="/reset-password"
        element={
          <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
            <ResetPasswordLazyComponent />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
            <LoginLazyComponent />
          </Suspense>
        }
      />
    </Routes>
  );
}
