import Hero from "@/components/Hero";
import AboutSection from "@/components/About-Section";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {
	return (
		<PageWrapper>
			<main className="flex min-h-screen flex-col justify-center items-center">
				<Hero />
				<AboutSection />
			</main>
		</PageWrapper>
	);
}
