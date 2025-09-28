import { useAtom } from 'jotai';
import { themeAtom, resolvedThemeAtom } from '../states/theme';
import { useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [resolved] = useAtom(resolvedThemeAtom);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const root = document.documentElement;
    if (resolved === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme, resolved]);

  return { theme, resolvedTheme: resolved, setTheme };
}
