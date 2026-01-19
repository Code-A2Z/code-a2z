import { lazy } from 'react';

export const ProjectLazyComponentV1 = lazy(() => import('./project/v1'));
export const SearchLazyComponentV1 = lazy(() => import('./search/v1'));
export const EditorLazyComponentV1 = lazy(() => import('./editor/v1'));
