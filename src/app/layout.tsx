import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "LiveVitals - Video Calling Health App",
	description: "Connect with healthcare professionals through video calls",
};

export default function RootLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<ViewTransitions>
			<html
				lang="en"
				suppressHydrationWarning
			>
				<body className={inter.className}>
					<ThemeProvider>
						<div className="flex min-h-screen flex-col">
							<Navbar />
							<div className="flex-1">{children}</div>
							<Footer />
						</div>
					</ThemeProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
