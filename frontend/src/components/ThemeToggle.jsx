import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

const ThemeToggle = () => {
    const { theme, setThemeMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const themes = [
        { name: 'Light', value: 'light', icon: 'fi fi-rr-sun' },
        { name: 'Dark', value: 'dark', icon: 'fi fi-rr-moon' },
        { name: 'System', value: 'system', icon: 'fi fi-rr-laptop' },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors"
                aria-label="Theme settings"
            >
                <i
                    className={`text-xl ${theme === 'system'
                        ? 'fi fi-rr-laptop'
                        : theme === 'dark'
                            ? 'fi fi-rr-moon inline-block rotate-[-45deg]'
                            : 'fi fi-rr-sun'
                        }`}
                ></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#27272a] z-50">
                    <div className="py-1">
                        {themes.map(({ name, value, icon }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setThemeMode(value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${theme === value
                                    ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <i className={`${icon} mr-3 ${icon == "fi fi-rr-moon" ? "transform -rotate-45" : ""}`}></i>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeToggle;
