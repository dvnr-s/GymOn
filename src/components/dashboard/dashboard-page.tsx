"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { Activity, Target, Utensils, Weight } from "lucide-react";
import { HealthDataContext } from "@/context/health-data-context";
import PageWrapper from "@/components/PageWrapper";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthMetricsChart } from "@/components/dashboard/health-metrics-chart";
import { CalorieGoalChart } from "@/components/dashboard/calorie-goal-chart";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { MacronutrientDistributionChart } from "@/components/dashboard/macronutrient-distribution-chart";

export default function DashboardPage() {
	const { healthData } = useContext(HealthDataContext);
	const {
		currentWeight,
		currentHeight,
		dailyCalories,
		weeklyCalories,
		dailyMacros,
	} = healthData;

	const cardVariants = {
		initial: { y: 20, opacity: 0 },
		animate: { y: 0, opacity: 1 },
	};

	return (
		<PageWrapper>
			<div className="container mx-auto p-8">
				<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<motion.div
						initial="initial"
						animate="animate"
						variants={cardVariants}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Weight
								</CardTitle>
								<Weight className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{currentWeight} kg
								</div>
								<p className="text-xs text-muted-foreground">
									Last updated today
								</p>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial="initial"
						animate="animate"
						variants={cardVariants}
						transition={{ duration: 0.3, delay: 0.2 }}
					>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Height
								</CardTitle>
								<Activity className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{currentHeight} cm
								</div>
								<p className="text-xs text-muted-foreground">
									Last updated 2 days ago
								</p>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial="initial"
						animate="animate"
						variants={cardVariants}
						transition={{ duration: 0.3, delay: 0.3 }}
					>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Daily Calories
								</CardTitle>
								<Utensils className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{dailyCalories.consumed} kcal
								</div>
								<p className="text-xs text-muted-foreground">
									Target: {dailyCalories.target} kcal
								</p>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial="initial"
						animate="animate"
						variants={cardVariants}
						transition={{ duration: 0.3, delay: 0.4 }}
					>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									BMI
								</CardTitle>
								<Target className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{(
										currentWeight /
										((currentHeight / 100) * (currentHeight / 100))
									).toFixed(1)}
								</div>
								<p className="text-xs text-muted-foreground">
									Normal range: 18.5 - 24.9
								</p>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				<Tabs
					defaultValue="overview"
					className="space-y-4"
				>
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="weight">Weight</TabsTrigger>
						<TabsTrigger value="calories">Calories</TabsTrigger>
						<TabsTrigger value="macros">Macronutrients</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<Card>
							<CardHeader>
								<CardTitle>Health Metrics Over Time</CardTitle>
								<CardDescription>
									Track your progress over the last 30 days
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<HealthMetricsChart data={healthData.healthHistory} />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="weight">
						<Card>
							<CardHeader>
								<CardTitle>Weight History</CardTitle>
								<CardDescription>
									Your weight fluctuations over time
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<WeightChart data={healthData.healthHistory} />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="calories">
						<Card>
							<CardHeader>
								<CardTitle>Calorie Intake vs Goal</CardTitle>
								<CardDescription>
									Your daily calorie consumption relative to your
									target
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<CalorieGoalChart data={weeklyCalories} />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="macros">
						<Card>
							<CardHeader>
								<CardTitle>Macronutrient Distribution</CardTitle>
								<CardDescription>
									Breakdown of your protein, carbs, and fat intake
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<MacronutrientDistributionChart data={dailyMacros} />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</PageWrapper>
	);
}
