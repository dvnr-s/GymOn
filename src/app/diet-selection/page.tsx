import type { Metadata } from "next";
import DietSelectionPage from "@/components/diet-selection/diet-selection-page";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Diet Selection | GymOn",
  description: "Choose a diet plan that fits your lifestyle",
};

export default function DietSelection() {
  return (
    <ProtectedRoute>
      <DietSelectionPage />
    </ProtectedRoute>
  );
}
