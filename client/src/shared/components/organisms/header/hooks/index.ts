import { useRef, useState, useEffect, useCallback } from 'react';
import { useDevice } from '../../../../hooks/use-device';

export const useHeader = ({
  externalSearchTerm,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  enableSearch = true,
}: {
  externalSearchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSearchClear?: () => void;
  enableSearch?: boolean;
}) => {
  const { isDesktop } = useDevice();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [internalSearchTerm, setInternalSearchTerm] = useState<string>('');

  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setInternalSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchChange = (value: string) => {
    setInternalSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleSearchSubmit = () => {
    onSearchSubmit?.(internalSearchTerm);
  };

  const handleClearSearch = () => {
    setInternalSearchTerm('');
    onSearchClear?.();
  };

  const triggerSearchByKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        e.stopPropagation();

        if (isDesktop && searchInputRef.current) {
          setTimeout(() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus();
              searchInputRef.current.select();
            }
          }, 10);
        }
      }
    },
    [isDesktop]
  );

  useEffect(() => {
    if (!enableSearch) {
      return;
    }

    document.addEventListener('keydown', triggerSearchByKeyboard, true);
    return () => {
      document.removeEventListener('keydown', triggerSearchByKeyboard, true);
    };
  }, [enableSearch, triggerSearchByKeyboard]);

  return {
    mobileMoreAnchorEl,
    isMobileMenuOpen,
    handleMobileMenuClose,
    handleMobileMenuOpen,
    internalSearchTerm,
    handleSearchChange,
    handleSearchSubmit,
    handleClearSearch,
    searchInputRef,
  };
};
