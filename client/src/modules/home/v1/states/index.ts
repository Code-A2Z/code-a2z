import { atom } from 'jotai';
import {
  getAllProjectsResponse,
  getTrendingProjectsResponse,
} from '../../../../infra/rest/apis/project/typing';

export const HomePageStateAtom = atom<string>('home');

export const HomePageProjectsAtom = atom<getAllProjectsResponse[]>([]);

export const HomePageTrendingProjectsAtom = atom<getTrendingProjectsResponse[]>(
  []
);
