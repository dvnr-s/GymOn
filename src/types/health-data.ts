export interface HealthData {
	currentWeight: number;
	currentHeight: number;
	dailyCalories: {
		consumed: number;
		target: number;
	};
	dailyMacros: {
		protein: number;
		carbs: number;
		fat: number;
	};
	weeklyCalories: Array<{
		day: string;
		consumed: number;
		target: number;
	}>;
	healthHistory: Array<{
		date: string;
		weight: number;
		calories: number;
	}>;
	healthGoals: {
		startingWeight: number;
		targetWeight: number;
		targetDate: string;
		weeklyActivityMinutes: number;
		activityType: string[];
		proteinTarget: number;
		waterIntakeTarget: number;
		dietaryPreferences: string[];
	};
	healthNotes: string;
	userProfile: UserProfile;
}

export interface UserProfile {
	name: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	location: string;
	bio: string;
	avatarUrl: string;
	memberSince: string;
	bloodType: string | null;
	emergencyContact: string | null;
	allergies: string[];
	medicalConditions: string[];
	medications: string[];
}
