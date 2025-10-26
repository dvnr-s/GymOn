import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboard-page";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Dashboard | GymOn",
  description: "View your health dashboard",
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
