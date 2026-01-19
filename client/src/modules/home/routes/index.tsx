import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../../app/routes/auth-routes/protected-route';
import { ROUTES_HOME_V1 } from '../../../app/routes/constants/routes';
import { EditorLazyComponentV1, ProjectLazyComponentV1 } from '../modules';

export const homeRoutes = () => {
  const routes: React.ReactNode[] = [
    <Route
      key={ROUTES_HOME_V1.PROJECT}
      path={ROUTES_HOME_V1.PROJECT}
      element={
        <ProtectedRoute component={ProjectLazyComponentV1} hasAccess={true} />
      }
    />,
    <Route
      key={ROUTES_HOME_V1.EDITOR}
      path={ROUTES_HOME_V1.EDITOR}
      element={
        <ProtectedRoute component={EditorLazyComponentV1} hasAccess={true} />
      }
    />,
    <Route
      key={ROUTES_HOME_V1.EDITOR_WITH_ID}
      path={ROUTES_HOME_V1.EDITOR_WITH_ID}
      element={
        <ProtectedRoute component={EditorLazyComponentV1} hasAccess={true} />
      }
    />,
  ];

  return { routes };
};

export enum HOME_QUERY_PARAMS {
  SEARCH_TERM = 'searchTerm',
}
