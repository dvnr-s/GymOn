import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/types/health-data";

interface ProfileInfoCardProps {
	profile: UserProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Information</CardTitle>
				<CardDescription>
					Your personal and health information
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<h3 className="font-semibold">Personal Details</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
						<div>
							<div className="text-sm text-muted-foreground">
								Full Name
							</div>
							<div>{profile.name}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Date of Birth
							</div>
							<div>{profile.dateOfBirth}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Gender</div>
							<div>{profile.gender}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Blood Type
							</div>
							<div>{profile.bloodType || "Not specified"}</div>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="font-semibold">Contact Information</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
						<div>
							<div className="text-sm text-muted-foreground">Email</div>
							<div>{profile.email}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Phone</div>
							<div>{profile.phone}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Address
							</div>
							<div>{profile.location}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Emergency Contact
							</div>
							<div>{profile.emergencyContact || "Not specified"}</div>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="font-semibold">Medical Information</h3>
					<div className="grid grid-cols-1 gap-y-4">
						<div>
							<div className="text-sm text-muted-foreground">
								Allergies
							</div>
							<div>
								{profile.allergies.length > 0
									? profile.allergies.join(", ")
									: "None reported"}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Medical Conditions
							</div>
							<div>
								{profile.medicalConditions.length > 0
									? profile.medicalConditions.join(", ")
									: "None reported"}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Medications
							</div>
							<div>
								{profile.medications.length > 0
									? profile.medications.join(", ")
									: "None reported"}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
