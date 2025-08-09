import { Suspense, lazy } from 'react';
import Loader from '../components/Loader';

// Enhanced lazy loading with error boundaries and better loading states
export const createLazyComponent = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <Loader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Predefined lazy components for common pages
export const LazyHome = createLazyComponent(() => import('../pages/Home'));
export const LazyProfile = createLazyComponent(() => import('../pages/Profile'));
export const LazyProject = createLazyComponent(() => import('../pages/Project'));
export const LazyEditor = createLazyComponent(() => import('../pages/Editor'));
export const LazySearch = createLazyComponent(() => import('../pages/Search'));
export const LazyNotifications = createLazyComponent(() => import('../pages/Notifications'));
export const LazyManageProjects = createLazyComponent(() => import('../pages/ManageProjects'));
export const LazyEditProfile = createLazyComponent(() => import('../pages/EditProfile'));
export const LazyChangePassword = createLazyComponent(() => import('../pages/ChangePassword'));

// Lazy load heavy components
export const LazyProjectEditor = createLazyComponent(() => import('../components/ProjectEditor'));
export const LazyProjectContent = createLazyComponent(() => import('../components/ProjectContent'));
export const LazyComments = createLazyComponent(() => import('../components/Comments'));

// Utility for conditional lazy loading
export const conditionalLazy = (condition, importFunc, fallback = null) => {
  if (condition) {
    return createLazyComponent(importFunc, fallback);
  }
  return null;
};

// Preload components for better perceived performance
export const preloadComponent = (importFunc) => {
  return () => {
    importFunc();
  };
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed
  setTimeout(() => {
    import('../pages/Home');
    import('../pages/Profile');
  }, 1000);
  
  // Preload on user interaction
  setTimeout(() => {
    import('../components/ProjectEditor');
    import('../components/ProjectContent');
  }, 2000);
};
