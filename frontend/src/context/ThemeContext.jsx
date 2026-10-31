import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "dark"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((current) => (current === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);