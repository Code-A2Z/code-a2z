import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return theme === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(mediaQuery.matches);

            const handleChange = (e) => setIsDarkMode(e.matches);
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            setIsDarkMode(theme === 'dark');
        }
    }, [theme]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const setThemeMode = (newTheme) => {
        setTheme(newTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, setThemeMode, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
};
