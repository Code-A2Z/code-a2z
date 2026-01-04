import { atom } from 'jotai';
import { getUserProfileResponse } from '../../../infra/rest/apis/user/typing';

export const EditProfileAtom = atom<getUserProfileResponse | null>(null);
