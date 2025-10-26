import { CalendarRange, Timer, Weight } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HealthData } from "@/types/health-data";

interface HealthGoalsCardProps {
	goals: HealthData["healthGoals"];
	currentStats: HealthData;
}

export function HealthGoalsCard({ goals, currentStats }: HealthGoalsCardProps) {
	const calculateWeightProgress = () => {
		if (
			currentStats.currentWeight > goals.startingWeight &&
			goals.targetWeight < goals.startingWeight
		) {
			// Weight loss goal, but gaining weight - negative progress
			return `You're ${(
				currentStats.currentWeight - goals.startingWeight
			).toFixed(1)} kg away from your starting point`;
		} else if (
			currentStats.currentWeight < goals.startingWeight &&
			goals.targetWeight > goals.startingWeight
		) {
			// Weight gain goal, but losing weight - negative progress
			return `You're ${(
				goals.startingWeight - currentStats.currentWeight
			).toFixed(1)} kg away from your starting point`;
		} else if (goals.targetWeight > goals.startingWeight) {
			// Weight gain goal
			const totalToGain = goals.targetWeight - goals.startingWeight;
			const gained = currentStats.currentWeight - goals.startingWeight;
			const percentComplete = Math.min(
				100,
				Math.round((gained / totalToGain) * 100),
			);
			return `${percentComplete}% complete (${gained.toFixed(
				1,
			)} kg gained of ${totalToGain.toFixed(1)} kg goal)`;
		} else {
			// Weight loss goal
			const totalToLose = goals.startingWeight - goals.targetWeight;
			const lost = goals.startingWeight - currentStats.currentWeight;
			const percentComplete = Math.min(
				100,
				Math.round((lost / totalToLose) * 100),
			);
			return `${percentComplete}% complete (${lost.toFixed(
				1,
			)} kg lost of ${totalToLose.toFixed(1)} kg goal)`;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Health Goals</CardTitle>
				<CardDescription>Your fitness and health targets</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<Weight className="h-5 w-5 text-primary mt-1" />
						<div>
							<h3 className="font-semibold">Weight Goal</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
								<div>
									<div className="text-sm text-muted-foreground">
										Starting Weight
									</div>
									<div className="font-medium">
										{goals.startingWeight} kg
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">
										Current Weight
									</div>
									<div className="font-medium">
										{currentStats.currentWeight} kg
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">
										Target Weight
									</div>
									<div className="font-medium">
										{goals.targetWeight} kg
									</div>
								</div>
							</div>
							<div className="mt-2">
								<div className="text-sm text-muted-foreground">
									Progress
								</div>
								<div>{calculateWeightProgress()}</div>
							</div>
							<div className="mt-2">
								<div className="text-sm text-muted-foreground">
									Target Date
								</div>
								<div>{goals.targetDate}</div>
							</div>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<Timer className="h-5 w-5 text-primary mt-1" />
						<div>
							<h3 className="font-semibold">Activity Goals</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
								<div>
									<div className="text-sm text-muted-foreground">
										Weekly Activity
									</div>
									<div className="font-medium">
										{goals.weeklyActivityMinutes} minutes
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">
										Activity Type
									</div>
									<div className="font-medium">
										{goals.activityType.join(", ")}
									</div>
								</div>
							</div>
							<div className="mt-2">
								<div className="text-sm text-muted-foreground">
									Current Progress
								</div>
								<div>187 minutes this week (75% of goal)</div>
							</div>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<CalendarRange className="h-5 w-5 text-primary mt-1" />
						<div>
							<h3 className="font-semibold">Nutritional Goals</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
								<div>
									<div className="text-sm text-muted-foreground">
										Daily Calories
									</div>
									<div className="font-medium">
										{currentStats.dailyCalories.target} kcal
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">
										Protein Target
									</div>
									<div className="font-medium">
										{goals.proteinTarget}g daily
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">
										Water Intake
									</div>
									<div className="font-medium">
										{goals.waterIntakeTarget} liters daily
									</div>
								</div>
							</div>
							<div className="mt-2">
								<div className="text-sm text-muted-foreground">
									Diet Preferences
								</div>
								<div>{goals.dietaryPreferences.join(", ")}</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
