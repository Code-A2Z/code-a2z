import { atom } from "jotai";

export type Theme = "light" | "dark" | "system";

const getSystemTheme = (): "light" | "dark" => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const savedTheme = (localStorage.getItem("theme") as Theme | null) || "system";

export const themeAtom = atom<Theme>(savedTheme);

export const resolvedThemeAtom = atom((get) => {
  const theme = get(themeAtom);
  return theme === "system" ? getSystemTheme() : theme;
});
