import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

const ThemeToggle = () => {
    const { theme, setThemeMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { name: 'Light', value: 'light', icon: 'fi fi-rr-sun' },
        { name: 'Dark', value: 'dark', icon: 'fi fi-rr-moon' },
        { name: 'System', value: 'system', icon: 'fi fi-rr-settings' }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors"
                aria-label="Theme settings"
            >
                {theme === 'system' ? (
                    <i className="fi fi-rr-settings text-xl"></i>
                ) : theme === 'dark' ? (
                    <i className="fi fi-rr-moon text-xl"></i>
                ) : (
                    <i className="fi fi-rr-sun text-xl"></i>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#27272a] ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {themes.map(({ name, value, icon }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setThemeMode(value)
                                    setIsOpen(false)
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm ${theme === value
                                    ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <i className={`${icon} mr-3`}></i>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default ThemeToggle;
