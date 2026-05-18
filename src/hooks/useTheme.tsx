import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";

export type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const initialState: ThemeState = {
    theme: "system",
    setTheme: () => null,
}

export const ThemeContext = createContext<ThemeState>(initialState);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}