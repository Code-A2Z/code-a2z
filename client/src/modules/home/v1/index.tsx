import { Badge, Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import MailIcon from '@mui/icons-material/Mail';
import { Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import Header from '../../../shared/components/organisms/header';
import { HeaderAction } from '../../../shared/components/organisms/header/typings';
import HomeContent from './components';
import useHomeV1 from './hooks';
import { HomePageProjectsAtom } from './states';
import { SearchLazyComponentV1 } from '../modules';
import useSearchV1 from '../modules/search/v1/hooks';
import SubscribeModal from './components/subscribe-modal';
import { useSubscribe } from './hooks/use-subscribe';
import {
  ROUTES_V1,
  ROUTES_HOME_V1,
} from '../../../app/routes/constants/routes';

const Home = () => {
  const setProjects = useSetAtom(HomePageProjectsAtom);

  const {
    routes,
    isHomePage,
    selectedCategory,
    setSelectedCategory,
    trendingProjects,
    fetchLatestProjects,
    fetchTrendingProjects,
    fetchProjectsByCategory,
    searchTerm,
    activeModule,
  } = useHomeV1();

  const { handleSearchChange, handleSearchSubmit, handleSearchClear } =
    useSearchV1();

  const {
    subscribeEmailRef,
    showSubscribeModal,
    setShowSubscribeModal,
    handleSubscribe,
  } = useSubscribe();

  const headerActions: HeaderAction[] = [
    {
      key: 'write',
      label: 'Write',
      icon: (
        <Badge>
          <CreateIcon />
        </Badge>
      ),
      link: `${ROUTES_V1.HOME}${ROUTES_HOME_V1.EDITOR}`,
    },
    {
      key: 'subscribe',
      label: 'Subscribe',
      icon: (
        <Badge>
          <MailIcon />
        </Badge>
      ),
      onClick: () => setShowSubscribeModal(true),
    },
  ];

  useEffect(() => {
    if (isHomePage) {
      if (searchTerm) {
        setProjects([]);
      } else {
        if (!selectedCategory) {
          fetchLatestProjects();
        } else if (selectedCategory !== 'trending') {
          fetchProjectsByCategory({ tag: selectedCategory });
        }
        fetchTrendingProjects();
      }
    }
  }, [
    selectedCategory,
    fetchLatestProjects,
    fetchProjectsByCategory,
    fetchTrendingProjects,
    isHomePage,
    searchTerm,
    setProjects,
  ]);

  if (!isHomePage) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <Routes>{routes}</Routes>
      </Box>
    );
  }

  return (
    <>
      <Header
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
        rightSideActions={headerActions}
      />

      {activeModule === 'search' ? (
        <SearchLazyComponentV1 />
      ) : (
        <HomeContent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          trendingProjects={trendingProjects}
          fetchLatestProjects={fetchLatestProjects}
          fetchProjectsByCategory={fetchProjectsByCategory}
        />
      )}

      <SubscribeModal
        subscribeEmailRef={subscribeEmailRef}
        showSubscribeModal={showSubscribeModal}
        setShowSubscribeModal={setShowSubscribeModal}
        handleSubscribe={handleSubscribe}
      />
    </>
  );
};

export default Home;
