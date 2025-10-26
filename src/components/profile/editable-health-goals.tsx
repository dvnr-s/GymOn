"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarRange, Timer, Weight, Edit2, Save, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { HealthData } from "@/types/health-data";
import { HealthDataContext } from "@/context/health-data-context";
import { toast } from "sonner";

const goalsSchema = z.object({
  targetWeight: z.coerce
    .number()
    .min(30, "Target weight must be at least 30kg")
    .max(300, "Target weight must be less than 300kg"),
  targetDate: z.string().min(1, "Target date is required"),
  weeklyActivityMinutes: z.coerce
    .number()
    .min(0, "Activity minutes must be positive")
    .max(2000, "Activity minutes must be reasonable"),
  activityType: z.string().min(1, "Activity type is required"),
  proteinTarget: z.coerce
    .number()
    .min(10, "Protein target must be at least 10g")
    .max(300, "Protein target must be less than 300g"),
  waterIntakeTarget: z.coerce
    .number()
    .min(1, "Water intake must be at least 1 liter")
    .max(10, "Water intake must be less than 10 liters"),
  dietaryPreferences: z.string().optional(),
});

interface EditableHealthGoalsProps {
  goals: HealthData["healthGoals"];
  currentStats: HealthData;
}

export function EditableHealthGoals({
  goals,
  currentStats,
}: EditableHealthGoalsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { updateHealthData } = useContext(HealthDataContext);

  const form = useForm<z.infer<typeof goalsSchema>>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      targetWeight: goals.targetWeight,
      targetDate: goals.targetDate,
      weeklyActivityMinutes: goals.weeklyActivityMinutes,
      activityType: goals.activityType.join(", "),
      proteinTarget: goals.proteinTarget,
      waterIntakeTarget: goals.waterIntakeTarget,
      dietaryPreferences: goals.dietaryPreferences.join(", "),
    },
  });

  const calculateWeightProgress = () => {
    if (
      currentStats.currentWeight > goals.startingWeight &&
      goals.targetWeight < goals.startingWeight
    ) {
      return `You're ${(
        currentStats.currentWeight - goals.startingWeight
      ).toFixed(1)} kg away from your starting point`;
    } else if (
      currentStats.currentWeight < goals.startingWeight &&
      goals.targetWeight > goals.startingWeight
    ) {
      return `You're ${(
        goals.startingWeight - currentStats.currentWeight
      ).toFixed(1)} kg away from your starting point`;
    } else if (goals.targetWeight > goals.startingWeight) {
      const totalToGain = goals.targetWeight - goals.startingWeight;
      const gained = currentStats.currentWeight - goals.startingWeight;
      const percentComplete = Math.min(
        100,
        Math.round((gained / totalToGain) * 100)
      );
      return `${percentComplete}% complete (${gained.toFixed(
        1
      )} kg gained of ${totalToGain.toFixed(1)} kg goal)`;
    } else {
      const totalToLose = goals.startingWeight - goals.targetWeight;
      const lost = goals.startingWeight - currentStats.currentWeight;
      const percentComplete = Math.min(
        100,
        Math.round((lost / totalToLose) * 100)
      );
      return `${percentComplete}% complete (${lost.toFixed(
        1
      )} kg lost of ${totalToLose.toFixed(1)} kg goal)`;
    }
  };

  const onSubmit = (values: z.infer<typeof goalsSchema>) => {
    setIsSaving(true);

    // Update health goals
    updateHealthData({
      healthGoals: {
        ...goals,
        targetWeight: values.targetWeight,
        targetDate: values.targetDate,
        weeklyActivityMinutes: values.weeklyActivityMinutes,
        activityType: values.activityType.split(",").map((s) => s.trim()),
        proteinTarget: values.proteinTarget,
        waterIntakeTarget: values.waterIntakeTarget,
        dietaryPreferences: values.dietaryPreferences
          ? values.dietaryPreferences.split(",").map((s) => s.trim())
          : [],
      },
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Health goals updated successfully!");
    }, 1000);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Health Goals</CardTitle>
              <CardDescription>
                Update your fitness and health targets
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weeklyActivityMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Activity (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Types</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Running, Swimming, Gym"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proteinTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Protein Target (g)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waterIntakeTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Water Intake (liters)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vegetarian, Gluten-free, Low-carb"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Goals
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Health Goals</CardTitle>
            <CardDescription>Your fitness and health targets</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Goals
          </Button>
        </div>
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
                  <div className="font-medium">{goals.startingWeight} kg</div>
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
                  <div className="font-medium">{goals.targetWeight} kg</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div>{calculateWeightProgress()}</div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-muted-foreground">Target Date</div>
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
