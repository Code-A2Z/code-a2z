/* eslint-disable react-refresh/only-export-components */
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { ROUTES_V1 } from '../../../app/routes/constants/routes';
import { SettingTabType } from '../typings';
import { Navigate, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../../app/routes/auth-routes/protected-route';
import { lazy } from 'react';

export const ProfileLazyComponentV1 = lazy(
  () => import('../../modules/profile/v1')
);

export const getSettings = ({
  isMobileOrTablet,
}: {
  isMobileOrTablet: boolean;
}) => {
  const settings: SettingTabType[] = [
    {
      id: 'profile',
      icon: <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />,
      path: ROUTES_V1.SETTINGS_PROFILE,
      name: 'Your profile',
      description: 'Edit your personal details',
    },
  ];

  const routes: React.ReactNode[] = [
    <Route
      key={ROUTES_V1.SETTINGS_PROFILE}
      path={ROUTES_V1.SETTINGS_PROFILE}
      element={
        <ProtectedRoute component={ProfileLazyComponentV1} hasAccess={true} />
      }
    />,

    !isMobileOrTablet && (
      <Route
        key="*"
        path="*"
        element={
          <Navigate
            to={`${ROUTES_V1.SETTINGS}${ROUTES_V1.SETTINGS_PROFILE}`}
            replace
          />
        }
      />
    ),
  ];

  return {
    settings: settings,
    routes: routes,
  };
};
