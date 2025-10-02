import { atom } from 'jotai';
import { AllProjectsData, Project, TrendingProject } from '../typings/project';
import { emptyTrendingProjectsState } from './emptyStates/project';

export const AllProjectsAtom = atom<AllProjectsData | null>(null);

export const ProjectAtom = atom<Project | null>(null);

export const TrendingProjectAtom = atom<TrendingProject[]>(
  emptyTrendingProjectsState
);

export const DraftProjectAtom = atom<AllProjectsData | null>(null);
