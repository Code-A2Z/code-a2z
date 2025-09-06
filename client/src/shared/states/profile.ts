import { atom } from "jotai";
import { Profile } from "../typings";

export const ProfileAtom = atom<Profile | null>(null);
