import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | NettoPro",
  description: "Connectez-vous à votre espace professionnel NettoPro",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <LoginForm />
    </div>
  );
}
