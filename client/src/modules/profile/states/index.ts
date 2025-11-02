import { atom } from 'jotai';
import { getUserProfileResponse } from '../../../infra/rest/apis/user/typing';

export const ProfileAtom = atom<getUserProfileResponse | null>(null);
