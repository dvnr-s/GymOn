"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative w-full overflow-hidden">
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Healthcare at your fingertips with{" "}
          <span className="text-primary">GymOn</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Connect with healthcare professionals through secure, high-quality
          video calls. Get the care you need, when you need it.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href={isAuthenticated ? "/instructor-chat" : "/login"}>
              Start a consultation
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
