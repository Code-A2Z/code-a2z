import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ROUTES_V1 } from '../../constants/routes';
import { LOADING } from '../../constants';
import Loader from '../../../../shared/components/molecules/loader';
import {
  HomePageLazyComponent,
  ChatsPageLazyComponent,
  NotesPageLazyComponent,
  CodePageLazyComponent,
  SettingsPageLazyComponent,
} from '../../../components';

export default function getRoutesV1() {
  const routes = [
    <Route
      key={`${ROUTES_V1.HOME}/*`}
      path={`${ROUTES_V1.HOME}/*`}
      element={
        <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
          <HomePageLazyComponent />
        </Suspense>
      }
    />,
    <Route
      key={`${ROUTES_V1.CHATS}/*`}
      path={`${ROUTES_V1.CHATS}/*`}
      element={
        <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
          <ChatsPageLazyComponent />
        </Suspense>
      }
    />,
    <Route
      key={`${ROUTES_V1.NOTES}/*`}
      path={`${ROUTES_V1.NOTES}/*`}
      element={
        <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
          <NotesPageLazyComponent />
        </Suspense>
      }
    />,
    <Route
      key={`${ROUTES_V1.CODE}/*`}
      path={`${ROUTES_V1.CODE}/*`}
      element={
        <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
          <CodePageLazyComponent />
        </Suspense>
      }
    />,
    <Route
      key={`${ROUTES_V1.SETTINGS}/*`}
      path={`${ROUTES_V1.SETTINGS}/*`}
      element={
        <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
          <SettingsPageLazyComponent />
        </Suspense>
      }
    />,
  ];

  if (routes.length) {
    routes.push(
      <Route
        key="*"
        path="*"
        element={<Navigate to={ROUTES_V1.HOME} replace />}
      />
    );
  }

  return routes;
}
