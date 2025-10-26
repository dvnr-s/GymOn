import type { Metadata } from "next";
import DataInputPage from "@/components/data-input/data-input-page";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Data Input | GymOn",
  description: "Input your health metrics",
};

export default function DataInput() {
  return (
    <ProtectedRoute>
      <DataInputPage />
    </ProtectedRoute>
  );
}
