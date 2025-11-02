import { atom } from 'jotai';

export const THEME_LOCAL_STORAGE_KEY = 'theme';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

const getSystemTheme = (): THEME =>
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME.DARK
    : THEME.LIGHT;

const savedTheme =
  (localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as THEME | null) ||
  THEME.SYSTEM;

export const ThemeAtom = atom<THEME>(savedTheme);

export const ResolvedThemeAtom = atom(get => {
  const theme = get(ThemeAtom);
  return theme === THEME.SYSTEM ? getSystemTheme() : theme;
});
