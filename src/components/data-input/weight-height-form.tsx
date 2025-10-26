"use client";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
	weight: z
		.number()
		.min(30, "Weight must be at least 30kg")
		.max(300, "Weight must be less than 300kg"),
	height: z
		.number()
		.min(100, "Height must be at least 100cm")
		.max(250, "Height must be less than 250cm"),
});

interface WeightHeightFormProps {
	initialWeight: number;
	initialHeight: number;
	onSave: (data: { weight: number; height: number }) => void;
	isSaving: boolean;
}

export function WeightHeightForm({
	initialWeight,
	initialHeight,
	onSave,
	isSaving,
}: Readonly<WeightHeightFormProps>) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			weight: initialWeight,
			height: initialHeight,
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		onSave(values);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="weight"
					render={({ field }) => (
						<FormItem>
							<div className="space-y-1">
								<FormLabel>Weight (kg)</FormLabel>
								<FormDescription>
									Drag the slider to set your current weight
								</FormDescription>
							</div>
							<div className="space-y-4 pt-4">
								<FormControl>
									<Slider
										defaultValue={[field.value]}
										min={30}
										max={150}
										step={0.1}
										onValueChange={(vals) => {
											field.onChange(vals[0]);
										}}
									/>
								</FormControl>
								<motion.div
									key={field.value}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="mx-auto text-center font-medium text-2xl"
								>
									{field.value.toFixed(1)} kg
								</motion.div>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="height"
					render={({ field }) => (
						<FormItem>
							<div className="space-y-1">
								<FormLabel>Height (cm)</FormLabel>
								<FormDescription>
									Enter your current height in centimeters
								</FormDescription>
							</div>
							<div className="space-y-4 pt-4">
								<FormControl>
									<Slider
										defaultValue={[field.value]}
										min={100}
										max={220}
										step={1}
										onValueChange={(vals) => {
											field.onChange(vals[0]);
										}}
									/>
								</FormControl>
								<motion.div
									key={field.value}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="mx-auto text-center font-medium text-2xl"
								>
									{field.value} cm
								</motion.div>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={isSaving}
				>
					{isSaving ? "Saving..." : "Save Measurements"}
				</Button>
			</form>
		</Form>
	);
}
