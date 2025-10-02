import { atom } from 'jotai';
import { Notification } from '../typings/notification';

export const notificationsAtom = atom<Notification[]>([]);
