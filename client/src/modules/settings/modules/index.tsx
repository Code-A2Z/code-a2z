import { lazy } from 'react';

export const ProfileLazyComponentV1 = lazy(() => import('./profile/v1'));
export const IntegrationsLazyComponentV1 = lazy(
  () => import('./integrations/v1')
);
