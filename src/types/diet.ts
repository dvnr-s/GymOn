export interface DietPlan {
	id: string;
	name: string;
	shortDescription: string;
	description: string;
	dailyCalories: number;
	macroRatio: {
		protein: number;
		carbs: number;
		fat: number;
	};
	tags: string[];
	benefits: string[];
	recommendedFor: string;
	duration: string;
	sampleMeals: Array<{
		name: string;
		time: string;
		calories: number;
		items: string[];
	}>;
	tipsSummary: string;
	tips: string[];
}
