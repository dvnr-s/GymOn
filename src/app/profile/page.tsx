import type { Metadata } from "next";
import ProfilePage from "@/components/profile/profile-page";

export const metadata: Metadata = {
	title: "Profile | HealthTrack",
	description: "View and edit your profile",
};

export default function Profile() {
	return <ProfilePage />;
}
