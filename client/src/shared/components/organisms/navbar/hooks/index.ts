import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../../../hooks/use-device';
import { useNotifications } from '../../../../hooks/use-notification';
import { emailRegex } from '../../../../utils/regex';
import { subscribeUser } from '../../../../../infra/rest/apis/subscriber';

export const useNavbar = () => {
  const navigate = useNavigate();
  const { isDesktop } = useDevice();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = () => {
    if (!searchTerm.trim().length) {
      navigate('/');
      return;
    }
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const triggerSearchByKeyboard = (e: KeyboardEvent) => {
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
  };

  useEffect(() => {
    document.addEventListener('keydown', triggerSearchByKeyboard, true);
    return () => {
      document.removeEventListener('keydown', triggerSearchByKeyboard, true);
    };
  }, [isDesktop]);

  return {
    mobileMoreAnchorEl,
    isMobileMenuOpen,
    handleMobileMenuClose,
    handleMobileMenuOpen,
    searchTerm,
    handleSearchChange,
    handleSearchSubmit,
    handleClearSearch,
    searchInputRef,
  };
};

export const useSubscribe = () => {
  const { addNotification } = useNotifications();
  const subscribeEmailRef = useRef<HTMLInputElement>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);

  const handleSubscribe = async () => {
    const email = subscribeEmailRef.current?.value || '';
    if (!email.trim().length) {
      addNotification({
        message: 'Email is required',
        type: 'error',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      addNotification({
        message: 'Please enter a valid email',
        type: 'error',
      });
      return;
    }

    const response = await subscribeUser(email);
    addNotification({
      message: response.message,
      type: response.status,
    });
    setShowSubscribeModal(false);
  };

  return {
    subscribeEmailRef,
    showSubscribeModal,
    setShowSubscribeModal,
    handleSubscribe,
  };
};
