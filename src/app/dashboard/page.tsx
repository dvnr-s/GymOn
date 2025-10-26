import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboard-page";

export const metadata: Metadata = {
	title: "Dashboard | HealthTrack",
	description: "View your health metrics and progress",
};

export default function Dashboard() {
	return <DashboardPage />;
}
