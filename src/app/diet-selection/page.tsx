import type { Metadata } from "next";
import DietSelectionPage from "@/components/diet-selection/diet-selection-page";

export const metadata: Metadata = {
	title: "Diet Selection | HealthTrack",
	description: "Choose a diet plan that fits your lifestyle",
};

export default function DietSelection() {
	return <DietSelectionPage />;
}
