"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
}

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
	children,
	defaultTheme = "system",
}: Readonly<ThemeProviderProps>) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme") as Theme | null;
		if (storedTheme) {
			setTheme(storedTheme);
		} else if (defaultTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			setTheme(systemTheme);
		}
	}, [defaultTheme]);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}

		localStorage.setItem("theme", theme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
