import { atom } from "jotai";
import { Profile } from "../typings/profile";
import { emptyProfileState } from "./emptyStates/profile";

export const ProfileAtom = atom<Profile>(emptyProfileState);
