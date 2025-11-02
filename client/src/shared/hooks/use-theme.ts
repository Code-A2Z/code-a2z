import { useAtom } from 'jotai';
import {
  ThemeAtom,
  ResolvedThemeAtom,
  THEME,
  THEME_LOCAL_STORAGE_KEY,
} from '../states/theme';
import { useEffect } from 'react';

export function useA2ZTheme() {
  const [theme, setTheme] = useAtom(ThemeAtom);
  const [resolved] = useAtom(ResolvedThemeAtom);

  useEffect(() => {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);

    const root = document.documentElement;
    if (resolved === THEME.DARK) root.classList.add(THEME.DARK);
    else root.classList.remove(THEME.DARK);
  }, [theme, resolved]);

  return { theme, resolvedTheme: resolved, setTheme };
}
