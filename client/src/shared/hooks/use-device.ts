import { useEffect, useState } from 'react';

const breakpoints = {
  mobile: 640,
  tablet: 900,
  laptop: 1024,
};

export function useDevice() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isLaptop: width >= breakpoints.tablet && width < breakpoints.laptop,
    isDesktop: width >= breakpoints.laptop,

    isMobileOrTablet: width < breakpoints.tablet,
  };
}
