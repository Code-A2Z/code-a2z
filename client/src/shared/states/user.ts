import { atom } from "jotai";
import { User } from "../typings";

export const UserAtom = atom<User | null>(null);
