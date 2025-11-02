import { atom } from 'jotai';
import {
  GetCommentsResponse,
  GetRepliesResponse,
} from '../../../../../infra/rest/apis/comment/typing';

export interface Comments extends GetCommentsResponse {
  children_level?: number;
  is_reply_loaded?: boolean;
}

export interface Replies extends GetRepliesResponse {
  children_level?: number;
}

export const CommentsWrapperAtom = atom<boolean>(false);

export const TotalParentCommentsLoadedAtom = atom<number>(0);

export const AllCommentsAtom = atom<Comments[] | null>(null);

export const AllRepliesAtom = atom<Replies[] | null>(null);
