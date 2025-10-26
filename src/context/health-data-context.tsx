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
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Sync with auth data if available
        if (userName || userEmail) {
          parsedData.userProfile = {
            ...parsedData.userProfile,
            name: userName || parsedData.userProfile.name,
            email: userEmail || parsedData.userProfile.email,
          };
        }
        setHealthData(parsedData);
      } catch (error) {
        console.error("Error parsing saved health data:", error);
      }
    } else if (userName || userEmail) {
      // If no saved data but we have auth info, update the initial data
      setHealthData((prev) => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          name: userName || prev.userProfile.name,
          email: userEmail || prev.userProfile.email,
        },
      }));
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
