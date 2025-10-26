"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Info } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { dietPlans } from "@/data/diet-plans";
import { DietDetailsModal } from "@/components/diet-selection/diet-details-modal";

export default function DietSelectionPage() {
	const [selectedDietId, setSelectedDietId] = useState<string | null>(null);
	// const [activeDietDetail, setActiveDietDetail] = useState<string | null>(
	// 	null,
	// );

	const handleSelectDiet = (dietId: string) => {
		setSelectedDietId(dietId);
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	return (
		<PageWrapper>
			<div className="container mx-auto p-8">
				<h1 className="text-3xl font-bold mb-2">Diet Selection</h1>
				<p className="text-muted-foreground mb-8">
					Choose a diet plan that fits your lifestyle and goals
				</p>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{dietPlans.map((diet) => (
						<motion.div
							key={diet.id}
							variants={cardVariants}
						>
							<Card
								className={`h-full ${
									selectedDietId === diet.id ? "border-primary" : ""
								}`}
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div>
											<CardTitle>{diet.name}</CardTitle>
											<CardDescription>
												{diet.shortDescription}
											</CardDescription>
										</div>
										{selectedDietId === diet.id && (
											<div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
												<Check className="h-3 w-3 text-primary-foreground" />
											</div>
										)}
									</div>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex flex-wrap gap-2 mb-4">
										{diet.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
											>
												{tag}
											</Badge>
										))}
									</div>
									<div className="space-y-1">
										<div className="flex justify-between text-sm">
											<span>Calories:</span>
											<span className="font-medium">
												{diet.dailyCalories} kcal/day
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Protein:</span>
											<span className="font-medium">
												{diet.macroRatio.protein}%
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Carbs:</span>
											<span className="font-medium">
												{diet.macroRatio.carbs}%
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Fat:</span>
											<span className="font-medium">
												{diet.macroRatio.fat}%
											</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="flex justify-between pt-2">
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												// onClick={() => setActiveDietDetail(diet.id)}
											>
												<Info className="h-4 w-4 mr-1" /> Details
											</Button>
										</DialogTrigger>
										<DietDetailsModal diet={diet} />
									</Dialog>
									<Button
										variant={
											selectedDietId === diet.id
												? "secondary"
												: "default"
										}
										onClick={() => handleSelectDiet(diet.id)}
									>
										{selectedDietId === diet.id
											? "Selected"
											: "Select"}{" "}
										<ChevronRight className="ml-1 h-4 w-4" />
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</PageWrapper>
	);
}
