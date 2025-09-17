import { atom } from "jotai";

export const LikedByUserAtom = atom<boolean>(false);

export const CommentsWrapperAtom = atom<boolean>(false);

export const TotalParentCommentsLoadedAtom = atom<number>(0);
