import type { Metadata } from "next";
import ProfilePage from "@/components/profile/profile-page";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Profile | GymOn",
  description: "View and edit your profile",
};

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
