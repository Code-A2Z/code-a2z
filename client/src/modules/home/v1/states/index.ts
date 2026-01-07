import { atom } from 'jotai';
import { getAllProjectsResponse } from '../../../../infra/rest/apis/project/typing';

export const HomePageProjectsAtom = atom<getAllProjectsResponse[]>([]);
