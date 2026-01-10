import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExtensionIcon from '@mui/icons-material/Extension';
import {
  ROUTES_V1,
  ROUTES_SETTINGS_V1,
  ROUTES_SETTINGS_INTEGRATIONS_V1,
} from '../../app/routes/constants/routes';
import { IntegrationSettingType, SettingTabType } from '../v1/typings';
import { Navigate, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../app/routes/auth-routes/protected-route';
import {
  ProfileLazyComponentV1,
  IntegrationsLazyComponentV1,
  OpenAILazyComponentV1,
} from '../modules';
import OpenAIIcon from '../../../shared/icons/openai';

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

export const integrationsRoutes = ({
  isMobileOrTablet,
}: {
  isMobileOrTablet: boolean;
}) => {
  const integrations: IntegrationSettingType[] = [
    {
      id: 'openai',
      type: 'integration',
      integrationSlug: 'openai',
      icon: <OpenAIIcon width={24} height={24} />,
      name: 'OpenAI',
      description: 'Setup your OpenAI integration',
      locked: false,
    },
  ];

  const routes: React.ReactNode[] = [
    <Route
      key={ROUTES_SETTINGS_INTEGRATIONS_V1.OPENAI}
      path={ROUTES_SETTINGS_INTEGRATIONS_V1.OPENAI}
      element={
        <ProtectedRoute component={OpenAILazyComponentV1} hasAccess={true} />
      }
    />,

    !isMobileOrTablet && (
      <Route
        key="*"
        path="*"
        element={
          <Navigate
            to={`${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.INTEGRATIONS}${ROUTES_SETTINGS_INTEGRATIONS_V1.OPENAI}`}
            replace
          />
        }
      />
    ),
  ];

  return {
    integrations,
    routes,
  };
};
