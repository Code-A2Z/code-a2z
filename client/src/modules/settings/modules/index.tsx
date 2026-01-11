import { lazy } from 'react';

export const ProfileLazyComponentV1 = lazy(() => import('./profile/v1'));
export const IntegrationsLazyComponentV1 = lazy(
  () => import('./integrations/v1')
);
export const OpenAILazyComponentV1 = lazy(
  () => import('./integrations/modules/openai/v1')
);
