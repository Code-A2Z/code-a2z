import { atom } from "jotai";
import { AllProjectsData, Project, TrendingProject } from "../typings";

export const AllProjectsAtom = atom<AllProjectsData | null>(null);

export const ProjectAtom = atom<Project | null>(null);

export const TrendingProjectAtom = atom<TrendingProject[] | null>(null);
