import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
	title: "Register | GymOn",
	description: "Create your GymOn account",
};

export default function RegisterPage() {
	return <RegisterForm />;
}