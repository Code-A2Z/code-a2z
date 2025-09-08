import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

    useEffect(() => {
        localStorage.setItem('theme', theme);

        const root = document.documentElement;

        const applyTheme = () => {
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const darkMode = theme === 'dark' || (theme === 'system' && isSystemDark);

            if (darkMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme();

        // If using system theme, listen for changes
        let mediaQuery;
        const handleChange = (e) => {
            if (theme === 'system') {
                applyTheme();
            }
        };

        if (theme === 'system') {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', handleChange);
        }

        return () => {
            if (mediaQuery) {
                mediaQuery.removeEventListener('change', handleChange);
            }
        };
    }, [theme]);

    const setThemeMode = (newTheme) => {
        setTheme(newTheme);
    };

    const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ThemeContext.Provider value={{ theme, setThemeMode, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
