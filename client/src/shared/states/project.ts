import { atom } from "jotai";
import { AllProjectsData, Project, TrendingProject } from "../typings/project";
import { emptyAllProjectsState, emptyProjectState, emptyTrendingProjectsState } from "./emptyStates/project";

export const AllProjectsAtom = atom<AllProjectsData>(emptyAllProjectsState);

export const ProjectAtom = atom<Project>(emptyProjectState);

export const TrendingProjectAtom = atom<TrendingProject[]>(emptyTrendingProjectsState);

export const DraftProjectAtom = atom<AllProjectsData>(emptyAllProjectsState);
