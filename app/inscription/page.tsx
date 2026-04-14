import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "./components/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription | NettoPro",
  description: "Créez votre compte professionnel sur NettoPro",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <RegisterForm />
    </div>
  );
}
