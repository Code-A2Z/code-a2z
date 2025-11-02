import { atom } from 'jotai';
import { searchUserResponse } from '../../../infra/rest/apis/user/typing';

export const SearchPageUsersAtom = atom<searchUserResponse[]>([]);
