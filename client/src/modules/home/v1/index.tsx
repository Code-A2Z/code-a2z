import { Box } from '@mui/material';
import { Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import Navbar from '../../../shared/components/organisms/navbar';
import HomeContent from './components';
import useHomeV1 from './hooks';
import { HomePageProjectsAtom } from './states';
import { SearchLazyComponentV1 } from '../modules';
import useSearchV1 from '../modules/search/v1/hooks';
import SubscribeModal from './components/subscribe-modal';
import { useSubscribe } from './hooks/use-subscribe';

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
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
        setShowSubscribeModal={setShowSubscribeModal}
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
