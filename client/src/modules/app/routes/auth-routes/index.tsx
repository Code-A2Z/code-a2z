import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../components';

export function AppProtectedRoutes() {
  return (
    <Routes>
      <Route key={'/*'} path={'/*'} element={<AppLayout />} />
    </Routes>
  );
}
