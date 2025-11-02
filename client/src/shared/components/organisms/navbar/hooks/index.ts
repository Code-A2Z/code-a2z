import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../../../hooks/use-device';
import { useNotifications } from '../../../../hooks/use-notification';
import { emailRegex } from '../../../../utils/regex';
import { subscribeUser } from '../../../../../infra/rest/apis/subscriber';
import { allNotificationCounts } from '../../../../../infra/rest/apis/notification';
import { NOTIFICATION_FILTER_TYPE } from '../../../../../infra/rest/typings';

export const useNavbar = () => {
  const navigate = useNavigate();
  const { isDesktop } = useDevice();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [searchBoxVisibility, setSearchBoxVisibility] =
    useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const searchRef = useRef<HTMLInputElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const query = event.currentTarget.value;
      if (!query.trim().length) {
        navigate('/');
        return;
      }
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  const triggerSearchByKeyboard = (e: KeyboardEvent) => {
    if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      e.stopPropagation();

      if (isDesktop) {
        setTimeout(() => {
          if (searchRef.current) {
            searchRef.current.focus();
            searchRef.current.select();
          }
        }, 10);
      } else {
        setSearchBoxVisibility(true);
        setTimeout(() => {
          if (searchRef.current) {
            searchRef.current.focus();
          }
        }, 100);
      }
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await allNotificationCounts({
        filter: NOTIFICATION_FILTER_TYPE.ALL,
      });
      if (response.status === 'success') {
        setNotificationCount(response?.data?.totalDocs || 0);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  return {
    anchorEl,
    mobileMoreAnchorEl,
    isMenuOpen,
    isMobileMenuOpen,
    handleProfileMenuOpen,
    handleMobileMenuClose,
    handleMenuClose,
    handleMobileMenuOpen,
    handleSearch,
    searchRef,
    searchBoxVisibility,
    setSearchBoxVisibility,
    triggerSearchByKeyboard,
    notificationCount,
    setNotificationCount,
    fetchNotificationCount,
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
