import { Check, Clock } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DietPlan } from "@/types/diet";

interface DietDetailsModalProps {
	readonly diet: DietPlan;
}

export function DietDetailsModal({ diet }: DietDetailsModalProps) {
	return (
		<DialogContent className="sm:max-w-[625px]">
			<DialogHeader>
				<DialogTitle>{diet.name}</DialogTitle>
				<DialogDescription>{diet.shortDescription}</DialogDescription>
			</DialogHeader>
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

			<Tabs defaultValue="overview">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="meals">Sample Meals</TabsTrigger>
					<TabsTrigger value="tips">Tips</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<ScrollArea className="h-[300px] pr-4">
						<div className="space-y-4">
							<p>{diet.description}</p>

							<div>
								<h4 className="font-semibold mb-2">
									Nutrition Profile:
								</h4>
								<div className="grid grid-cols-2 gap-2">
									<div className="flex justify-between">
										<span>Daily Calories:</span>
										<span className="font-medium">
											{diet.dailyCalories} kcal
										</span>
									</div>
									<div className="flex justify-between">
										<span>Protein:</span>
										<span className="font-medium">
											{diet.macroRatio.protein}%
										</span>
									</div>
									<div className="flex justify-between">
										<span>Carbs:</span>
										<span className="font-medium">
											{diet.macroRatio.carbs}%
										</span>
									</div>
									<div className="flex justify-between">
										<span>Fat:</span>
										<span className="font-medium">
											{diet.macroRatio.fat}%
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-semibold mb-2">Benefits:</h4>
								<ul className="space-y-1">
									{diet.benefits.map((benefit, idx) => (
										<li
											key={idx * 23}
											className="flex items-start gap-2"
										>
											<Check className="h-4 w-4 text-primary mt-1" />
											<span>{benefit}</span>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-2">Recommended For:</h4>
								<p>{diet.recommendedFor}</p>
							</div>

							<div>
								<h4 className="font-semibold mb-2">Duration:</h4>
								<div className="flex items-center">
									<Clock className="h-4 w-4 mr-2 text-muted-foreground" />
									<span>{diet.duration}</span>
								</div>
							</div>
						</div>
					</ScrollArea>
				</TabsContent>

				<TabsContent value="meals">
					<ScrollArea className="h-[300px] pr-4">
						<div className="space-y-6">
							{diet.sampleMeals.map((meal, idx) => (
								<div key={idx * 23}>
									<h4 className="font-semibold">{meal.name}</h4>
									<p className="text-sm text-muted-foreground mb-2">
										{meal.time} • {meal.calories} kcal
									</p>
									<ul className="space-y-1">
										{meal.items.map((item, itemIdx) => (
											<li
												key={itemIdx * 23}
												className="flex items-start gap-2"
											>
												<span>•</span>
												<span>{item}</span>
											</li>
										))}
									</ul>
									{idx < diet.sampleMeals.length - 1 && (
										<Separator className="mt-4" />
									)}
								</div>
							))}
						</div>
					</ScrollArea>
				</TabsContent>

				<TabsContent value="tips">
					<ScrollArea className="h-[300px] pr-4">
						<div className="space-y-4">
							<p>{diet.tipsSummary}</p>
							<ul className="space-y-2">
								{diet.tips.map((tip, idx) => (
									<li
										key={idx * 23}
										className="flex items-start gap-2"
									>
										<Check className="h-4 w-4 text-primary mt-1" />
										<span>{tip}</span>
									</li>
								))}
							</ul>
						</div>
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</DialogContent>
	);
}
