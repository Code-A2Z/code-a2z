import {
  NavigateOptions,
  Path as NavigatePath,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useMemo } from 'react';

export const useCustomNavigate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customNavigate = useMemo(() => {
    return (
      navigateTo: number | (Partial<NavigatePath> & { href?: string }),
      navigateOptions?: NavigateOptions & { clearExistingParams?: boolean }
    ): void => {
      if (typeof navigateTo === 'number') {
        navigate(navigateTo);
        return;
      }
      const { pathname, search, hash, href } = navigateTo;
      if (typeof href === 'string' && href.length > 0) {
        navigate(href, navigateOptions);
        return;
      }
      const existingUrlParams = new URLSearchParams(location.search);
      const newUrlParams = new URLSearchParams(search);
      const mergedUrlParams = new URLSearchParams(
        navigateOptions?.clearExistingParams
          ? Object.fromEntries(newUrlParams)
          : {
              ...Object.fromEntries(existingUrlParams),
              ...Object.fromEntries(newUrlParams),
            }
      ).toString();
      navigate(
        {
          pathname,
          search: mergedUrlParams.toString(),
          hash:
            typeof hash === 'string' && hash.length > 0 ? hash : location.hash,
        },
        navigateOptions
      );
    };
  }, [navigate, location.search, location.hash]);
  return customNavigate;
};
