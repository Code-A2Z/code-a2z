import { atom } from 'jotai';
import { USER_DB_STATE } from '../rest/typings';

export const UserAtom = atom<USER_DB_STATE | null>(null);
