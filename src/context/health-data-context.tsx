"use client";

import { createContext, useState, type ReactNode, useEffect } from "react";
import type { HealthData } from "@/types/health-data";
import { initialHealthData } from "@/data/initial-health-data";

interface HealthDataContextType {
	healthData: HealthData;
	updateHealthData: (newData: Partial<HealthData>) => void;
}

export const HealthDataContext = createContext<HealthDataContextType>({
	healthData: initialHealthData,
	updateHealthData: () => {},
});

export function HealthDataProvider({ children }: { children: ReactNode }) {
	const [healthData, setHealthData] = useState<HealthData>(initialHealthData);

	// Load data from localStorage on initial mount
	useEffect(() => {
		const savedData = localStorage.getItem("healthData");
		if (savedData) {
			try {
				setHealthData(JSON.parse(savedData));
			} catch (error) {
				console.error("Error parsing saved health data:", error);
			}
		}
	}, []);

	// Save data to localStorage when it changes
	useEffect(() => {
		localStorage.setItem("healthData", JSON.stringify(healthData));
	}, [healthData]);

	const updateHealthData = (newData: Partial<HealthData>) => {
		setHealthData((prevData) => ({
			...prevData,
			...newData,
		}));
	};

	return (
		<HealthDataContext.Provider value={{ healthData, updateHealthData }}>
			{children}
		</HealthDataContext.Provider>
	);
}
