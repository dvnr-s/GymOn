"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Edit, Mail, MapPin, Phone, Target, User } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { HealthDataContext } from "@/context/health-data-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { HealthGoalsCard } from "@/components/profile/health-goals-card";
import { EditableHealthGoals } from "@/components/profile/editable-health-goals";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";

export default function ProfilePage() {
  const { healthData } = useContext(HealthDataContext);
  const { userProfile, healthGoals } = healthData;
  const [activeTab, setActiveTab] = useState("info");

  return (
    <PageWrapper>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader className="relative pb-0 pt-6">
                  <div className="absolute -top-12 w-full flex justify-center">
                    <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden">
                      <Image
                        src={userProfile.avatarUrl || "/placeholder.svg"}
                        alt={userProfile.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="pt-12 text-center">
                    <CardTitle>{userProfile.name}</CardTitle>
                    <CardDescription>{userProfile.bio}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Member since {userProfile.memberSince}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("edit")}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Health Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weight Goal</span>
                      <span className="text-sm font-medium">
                        {healthGoals.targetWeight} kg
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (healthData.currentWeight / healthGoals.targetWeight) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Calorie Goal</span>
                      <span className="text-sm font-medium">
                        {healthData.dailyCalories.target} kcal
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (healthData.dailyCalories.consumed /
                          healthData.dailyCalories.target) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Activity Goal</span>
                      <span className="text-sm font-medium">
                        {healthGoals.weeklyActivityMinutes} min/week
                      </span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">
                  <User className="w-4 h-4 mr-2" />
                  Profile Info
                </TabsTrigger>
                <TabsTrigger value="goals">
                  <Target className="w-4 h-4 mr-2" />
                  Health Goals
                </TabsTrigger>
                <TabsTrigger value="edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6">
                <ProfileInfoCard profile={userProfile} />
              </TabsContent>

              <TabsContent value="goals" className="mt-6">
                <EditableHealthGoals
                  goals={healthGoals}
                  currentStats={healthData}
                />
              </TabsContent>

              <TabsContent value="edit" className="mt-6">
                <ProfileEditForm profile={userProfile} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
