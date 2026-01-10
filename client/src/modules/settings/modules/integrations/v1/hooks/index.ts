import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { integrationsRoutes } from '../../../../routes';
import { useDevice } from '../../../../../../shared/hooks/use-device';

const useIntegrationsSettings = () => {
  const location = useLocation();
  const { isMobileOrTablet } = useDevice();

  const { integrations, routes } = integrationsRoutes({ isMobileOrTablet });

  const integrationId = useMemo(() => {
    const pathParts = location.pathname.split('/');
    const integrationsIndex = pathParts.findIndex(
      part => part === 'integrations'
    );
    if (integrationsIndex !== -1 && pathParts[integrationsIndex + 1]) {
      const slug = pathParts[integrationsIndex + 1];
      return integrations.find(
        integration => integration.integrationSlug === slug
      )?.id;
    }
    return null;
  }, [location.pathname, integrations]);

  const activeIntegration = useMemo(() => {
    if (!integrationId) return undefined;
    return integrations.find(integration => integration.id === integrationId);
  }, [integrationId, integrations]);

  return {
    integrations,
    routes,
    integrationId,
    activeIntegration,
  };
};

export default useIntegrationsSettings;
