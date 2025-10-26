import AboutSection from "@/components/About-Section";
import PageWrapper from "@/components/PageWrapper";

export default function AboutPage() {
	return (
		<PageWrapper>
			<main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
				<div className="w-full max-w-5xl">
					<h1 className="mb-8 text-4xl font-bold tracking-tight">
						About Us
					</h1>
					<AboutSection showFullContent={true} />
				</div>
			</main>
		</PageWrapper>
	);
}
