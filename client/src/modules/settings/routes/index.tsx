import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExtensionIcon from '@mui/icons-material/Extension';
import {
  ROUTES_V1,
  ROUTES_SETTINGS_V1,
} from '../../app/routes/constants/routes';
import { SettingTabType } from '../v1/typings';
import { Navigate, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../app/routes/auth-routes/protected-route';
import {
  ProfileLazyComponentV1,
  IntegrationsLazyComponentV1,
} from '../modules';

export const settingsRoutes = ({
  isMobileOrTablet,
}: {
  isMobileOrTablet: boolean;
}) => {
  const settings: SettingTabType[] = [
    {
      id: 'profile',
      icon: <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />,
      path: ROUTES_SETTINGS_V1.PROFILE,
      name: 'Your profile',
      description: 'Edit your personal details',
    },
    {
      id: 'integrations',
      icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
      path: ROUTES_SETTINGS_V1.INTEGRATIONS,
      name: 'Integrations',
      description: 'Manage your integrations',
      locked: false,
    },
  ];

  const routes: React.ReactNode[] = [
    <Route
      key={ROUTES_SETTINGS_V1.PROFILE}
      path={ROUTES_SETTINGS_V1.PROFILE}
      element={
        <ProtectedRoute component={ProfileLazyComponentV1} hasAccess={true} />
      }
    />,
    <Route
      key={`${ROUTES_SETTINGS_V1.INTEGRATIONS}/*`}
      path={`${ROUTES_SETTINGS_V1.INTEGRATIONS}/*`}
      element={
        <ProtectedRoute
          component={IntegrationsLazyComponentV1}
          hasAccess={true}
        />
      }
    />,

    !isMobileOrTablet && (
      <Route
        key="*"
        path="*"
        element={
          <Navigate
            to={`${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.PROFILE}`}
            replace
          />
        }
      />
    ),
  ];

  return {
    settings,
    routes,
  };
};
