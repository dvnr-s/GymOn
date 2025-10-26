import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/auth-context";
import { HealthDataProvider } from "@/context/health-data-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GymOn - Healthcare at Your Fingertips",
  description:
    "Connect with healthcare professionals through secure, high-quality video calls. Get the care you need, when you need it.",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <AuthProvider>
              <HealthDataProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <div className="flex-1">{children}</div>
                  <Footer />
                </div>
                <Toaster richColors position="top-right" />
              </HealthDataProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
