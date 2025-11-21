"use client";

import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
	BadgePlus,
	HeartPulse,
	Save,
	ScrollText,
	Utensils,
	Weight,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { HealthDataContext } from "@/context/health-data-context";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightHeightForm } from "@/components/data-input/weight-height-form";
import { CalorieIntakeForm } from "@/components/data-input/calorie-intake-form";
import { HealthNotesForm } from "@/components/data-input/health-notes-form";
import { toast } from "sonner";

export default function DataInputPage() {
	const { healthData, updateHealthData } = useContext(HealthDataContext);
	const [isSaving, setIsSaving] = useState(false);

	const handleSaveWeightHeight = (data: {
		weight: number;
		height: number;
	}) => {
		setIsSaving(true);

		// Simulate saving to an API
		setTimeout(() => {
			updateHealthData({
				currentWeight: data.weight,
				currentHeight: data.height,
				healthHistory: [
					...healthData.healthHistory,
					{
						date: new Date().toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						}),
						weight: data.weight,
						calories: healthData.dailyCalories.consumed,
					},
				],
			});

			setIsSaving(false);
			toast.success("Weight and height data saved successfully");
		}, 800);
	};

	const handleSaveCalorieIntake = (data: {
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	}) => {
		setIsSaving(true);

		// Simulate saving to an API
		setTimeout(() => {
			updateHealthData({
				dailyCalories: {
					consumed: data.calories,
					target: healthData.dailyCalories.target,
				},
				dailyMacros: {
					protein: data.protein,
					carbs: data.carbs,
					fat: data.fat,
				},
			});

			setIsSaving(false);
			toast.success("Calorie intake data saved successfully");
		}, 800);
	};

	const handleSaveHealthNotes = (data: { notes: string }) => {
		setIsSaving(true);

		// Simulate saving to an API
		setTimeout(() => {
			updateHealthData({
				healthNotes: data.notes,
			});

			setIsSaving(false);
			toast.success("Health notes saved successfully");
		}, 800);
	};

	return (
		<PageWrapper>
			<div className="container mx-auto p-8">
				<h1 className="text-3xl font-bold mb-6">Data Input</h1>

				<Tabs
					defaultValue="weight-height"
					className="space-y-6"
				>
					<TabsList className="grid grid-cols-3 w-full max-w-md">
						<TabsTrigger value="weight-height">
							<Weight className="h-4 w-4 mr-2" />
							<span className="hidden sm:inline">Weight & Height</span>
						</TabsTrigger>
						<TabsTrigger value="calories">
							<Utensils className="h-4 w-4 mr-2" />
							<span className="hidden sm:inline">Calories</span>
						</TabsTrigger>
						<TabsTrigger value="notes">
							<ScrollText className="h-4 w-4 mr-2" />
							<span className="hidden sm:inline">Notes</span>
						</TabsTrigger>
					</TabsList>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2">
							<TabsContent
								value="weight-height"
								className="mt-0"
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Weight className="h-5 w-5 mr-2" />
											Weight & Height
										</CardTitle>
										<CardDescription>
											Update your current weight and height
											measurements
										</CardDescription>
									</CardHeader>
									<CardContent>
										<WeightHeightForm
											initialWeight={healthData.currentWeight}
											initialHeight={healthData.currentHeight}
											onSave={handleSaveWeightHeight}
											isSaving={isSaving}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent
								value="calories"
								className="mt-0"
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Utensils className="h-5 w-5 mr-2" />
											Calorie & Macronutrient Intake
										</CardTitle>
										<CardDescription>
											Enter your daily calorie and macronutrient
											consumption
										</CardDescription>
									</CardHeader>
									<CardContent>
										<CalorieIntakeForm
											initialCalories={
												healthData.dailyCalories.consumed
											}
											initialProtein={healthData.dailyMacros.protein}
											initialCarbs={healthData.dailyMacros.carbs}
											initialFat={healthData.dailyMacros.fat}
											onSave={handleSaveCalorieIntake}
											isSaving={isSaving}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent
								value="notes"
								className="mt-0"
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<ScrollText className="h-5 w-5 mr-2" />
											Health Notes
										</CardTitle>
										<CardDescription>
											Record any additional health information or
											observations
										</CardDescription>
									</CardHeader>
									<CardContent>
										<HealthNotesForm
											initialNotes={healthData.healthNotes}
											onSave={handleSaveHealthNotes}
											isSaving={isSaving}
										/>
									</CardContent>
								</Card>
							</TabsContent>
						</div>

						<div>
							<Card>
								<CardHeader>
									<CardTitle>Data Input Tips</CardTitle>
									<CardDescription>
										For the most accurate tracking
									</CardDescription>
								</CardHeader>
								<CardContent>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="space-y-4"
									>
										<div className="flex gap-2">
											<BadgePlus className="h-5 w-5 text-primary shrink-0 mt-0.5" />
											<div>
												<h3 className="font-medium">
													Consistency is Key
												</h3>
												<p className="text-sm text-muted-foreground">
													Try to measure yourself at the same time
													each day for the most accurate tracking.
												</p>
											</div>
										</div>

										<div className="flex gap-2">
											<HeartPulse className="h-5 w-5 text-primary shrink-0 mt-0.5" />
											<div>
												<h3 className="font-medium">Be Honest</h3>
												<p className="text-sm text-muted-foreground">
													Track all food intake, not just healthy
													meals, for accurate calorie counts.
												</p>
											</div>
										</div>

										<div className="flex gap-2">
											<Save className="h-5 w-5 text-primary shrink-0 mt-0.5" />
											<div>
												<h3 className="font-medium">
													Daily Updates
												</h3>
												<p className="text-sm text-muted-foreground">
													Update your data daily rather than trying
													to remember later in the week.
												</p>
											</div>
										</div>
									</motion.div>
								</CardContent>
							</Card>
						</div>
					</div>
				</Tabs>
			</div>
		</PageWrapper>
	);
}
