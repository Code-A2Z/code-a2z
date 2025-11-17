import { atom } from 'jotai';

// Shared atoms for manage-projects module
// Use a permissive any for the pagination shape to avoid coupling to a specific typing export
export const AllProjectsAtom = atom<any | null>(null);
export const DraftProjectAtom = atom<any | null>(null);
