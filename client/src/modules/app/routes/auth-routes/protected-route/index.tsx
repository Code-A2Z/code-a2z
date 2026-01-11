import { ComponentType, LazyExoticComponent, Suspense } from 'react';
import Loader from '../../../../../shared/components/molecules/loader';
import { LOADING } from '../../constants';
import ProtectedPlaceholder from './protected';

export const ProtectedRoute = ({
  component: LazyComponent,
  hasAccess,
}: {
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>>;
  hasAccess: boolean;
}) => {
  if (hasAccess) {
    return (
      <Suspense fallback={<Loader size={32} secondary={LOADING} />}>
        <LazyComponent />
      </Suspense>
    );
  }

  return <ProtectedPlaceholder />;
};
