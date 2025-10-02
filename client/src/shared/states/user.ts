import { atom } from 'jotai';
import { User } from '../typings/user';
import { emptyUserState } from './emptyStates/user';

export const UserAtom = atom<User>(emptyUserState);
