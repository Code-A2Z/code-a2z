import { atom } from "jotai";
import { AllProjectsData, TrendingProject } from "../typings";

export const ProjectAtom = atom<AllProjectsData | null>(null);

export const TrendingProjectAtom = atom<TrendingProject[] | null>(null);
