/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { lazy } from 'react';
import Header from '../../../shared/components/organisms/header';
import { HEADER_HEIGHT } from '../../../shared/components/organisms/header/constants';
import Sidebar from '../../../shared/components/organisms/sidebar';
import { SIDEBAR_WIDTH } from '../../../shared/components/organisms/sidebar/constants';
import { Routes } from 'react-router-dom';
import getRoutesV1 from '../routes/auth-routes/v1';

export const LoginLazyComponent = lazy(() => import('../../user-auth-form/v1'));
export const HomePageLazyComponent = lazy(() => import('../../home/v1'));
export const SettingsPageLazyComponent = lazy(
  () => import('../../settings/v1')
);

export const AppLayout = () => {
  return (
    <>
      <Header />
      <div
        css={css`
          height: calc(100vh - ${HEADER_HEIGHT}px);
        `}
      >
        <div
          css={css`
            height: 100%;
            display: flex;
            flex: 1;
            position: relative;
          `}
        >
          <Sidebar />
          <div
            css={css`
              height: 100%;
              width: 100%;
              min-width: 100%;
              max-width: 100%;
              flex: 1;
              padding-left: ${SIDEBAR_WIDTH}px;
              overflow: hidden;
            `}
          >
            <div
              css={css`
                height: 100%;
                transition: height 500ms ease-in-out;
                width: 100%;
                min-width: 100%;
                max-width: 100%;
                overflow: hidden;
              `}
            >
              <Routes>{getRoutesV1()}</Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
