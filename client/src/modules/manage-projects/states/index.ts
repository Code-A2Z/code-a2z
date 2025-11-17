import { atom } from 'jotai';
import { PROJECT_DB_STATE } from '../../../infra/rest/typings';

// Minimal pagination type used across the app
export interface PaginatedProjects {
  results: PROJECT_DB_STATE[];
  totalDocs: number;
  deletedDocCount?: number;
  page?: number;
}

export const AllProjectsAtom = atom<PaginatedProjects | null>(null);
export const DraftProjectAtom = atom<PaginatedProjects | null>(null);
