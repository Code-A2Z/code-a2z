import { atom } from 'jotai';
import { ProjectData } from '../../../../../../infra/rest/apis/project/typing';

export const SelectedProjectAtom = atom<ProjectData | null>(null);

export const LikedByUserAtom = atom<boolean>(false);
