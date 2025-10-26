import type { Metadata } from "next";
import DataInputPage from "@/components/data-input/data-input-page";

export const metadata: Metadata = {
	title: "Data Input | HealthTrack",
	description: "Input your health metrics",
};

export default function DataInput() {
	return <DataInputPage />;
}
