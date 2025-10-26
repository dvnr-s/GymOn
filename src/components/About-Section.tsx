import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Video, Shield, Clock } from "lucide-react";

interface AboutSectionProps {
  readonly showFullContent?: boolean;
}

export default function AboutSection({
  showFullContent = false,
}: AboutSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose GymOn
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              We&apos;re revolutionizing healthcare delivery through secure
              video consultations and innovative digital health solutions.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">High-Quality Video</h3>
            <p className="text-muted-foreground">
              Crystal clear video and audio for the best possible virtual care
              experience.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-muted-foreground">
              End-to-end encryption and HIPAA-compliant platform to protect your
              health information.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">24/7 Availability</h3>
            <p className="text-muted-foreground">
              Access healthcare professionals around the clock, whenever you
              need them.
            </p>
          </div>
        </div>

        {showFullContent && (
          <div className="mt-12 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                At GymOn, we believe that quality healthcare should be
                accessible to everyone, regardless of location or circumstance.
                Our mission is to bridge the gap between patients and healthcare
                providers through innovative technology, making healthcare more
                convenient, efficient, and personalized.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Team</h3>
              <p className="text-muted-foreground">
                Our team consists of healthcare professionals, technology
                experts, and customer service specialists who are passionate
                about transforming the healthcare experience. With decades of
                combined experience in both healthcare and technology sectors,
                we&apos;re uniquely positioned to understand and address the
                challenges of modern healthcare delivery.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Technology</h3>
              <p className="text-muted-foreground">
                We&apos;ve developed a proprietary video calling platform
                specifically optimized for healthcare consultations. Our
                technology ensures high-definition video quality even with
                limited bandwidth, provides tools for healthcare professionals
                to conduct thorough virtual examinations, and integrates
                seamlessly with electronic health records for comprehensive care
                management.
              </p>
            </div>
          </div>
        )}

        {!showFullContent && (
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/about">Learn more about us</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
