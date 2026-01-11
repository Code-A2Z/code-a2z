import { atom } from 'jotai';
import { userProjectsResponse } from '../../../infra/rest/apis/project/typing';

export interface ManageProjectsPaginationState {
  results: userProjectsResponse[];
  page: number;
  totalDocs: number;
  deletedDocCount?: number;
}

export const PublishedProjectsAtom = atom<ManageProjectsPaginationState | null>(
  null
);
export const DraftProjectsAtom = atom<ManageProjectsPaginationState | null>(
  null
);
