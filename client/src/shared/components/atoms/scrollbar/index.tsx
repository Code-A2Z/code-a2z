/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

const useScrollbar = () => {
  const scrollbarStyle = css`
    /* Total width */
    ::-webkit-scrollbar {
      background-color: rgba(0, 0, 0, 0);
      width: 10px; /* Increase width for spacing effect */
      height: 10px;
      overflow: overlay;
      scrollbar-color: #bcbcbc #f1f1f1;
    }

    /* Background of the scrollbar track */
    ::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0);
    }

    /* Scrollbar thumb */
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0); /* Initial color of thumb */
      border-radius: 1px; /* Round the corners */
      border: 2px solid transparent; /* Transparent border to create spacing */
      background-clip: padding-box; /* Ensures background doesn’t overlap border */
    }

    /* Hover effect for scrollbar thumb */
    :hover::-webkit-scrollbar-thumb {
      background-color: #bcbcbc; /* Change color on hover */
    }

    /* Scrollbar thumb hover effect */
    ::-webkit-scrollbar-thumb:hover {
      background-color: #888; /* Darker color on thumb hover */
    }

    /* Hide scrollbar buttons (top and bottom of scrollbar) */
    ::-webkit-scrollbar-button {
      display: none;
    }
  `;

  const GlobalScrollbar = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (isMac) return null;
    return <Global styles={scrollbarStyle} />;
  };

  return {
    GlobalScrollbar,
  };
};

export default useScrollbar;
