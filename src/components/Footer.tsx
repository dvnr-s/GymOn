import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col mx-auto items-center justify-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">GymOn</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GymOn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
