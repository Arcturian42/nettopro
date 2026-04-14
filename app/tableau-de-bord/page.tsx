import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanyStats } from "./components/CompanyStats";
import { CompanyEditForm } from "./components/CompanyEditForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tableau de bord | NettoPro",
  description: "Gérez votre entreprise sur NettoPro",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      company: {
        include: {
          categories: true,
          certifications: true,
        },
      },
    },
  });

  // Handle unclaimed state - user has no company
  if (!user?.company) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gérez votre profil et suivez vos statistiques
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Vous n&apos;avez pas encore réclamé de profil d&apos;entreprise.
          </AlertDescription>
        </Alert>

        <div className="bg-muted rounded-lg p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">
            Trouvez votre entreprise dans l&apos;annuaire
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Recherchez votre entreprise et réclamez votre profil pour le gérer, 
            ajouter vos informations et recevoir des demandes de contact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/annuaire">
              <Button variant="outline">
                Parcourir l&apos;annuaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/inscription">
              <Button>
                Ajouter mon entreprise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categories = await prisma.category.findMany();
  const certifications = await prisma.certification.findMany();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Gérez votre profil et suivez vos statistiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CompanyEditForm 
            company={user.company} 
            allCategories={categories}
            allCertifications={certifications}
          />
        </div>
        <div>
          <CompanyStats company={user.company} />
        </div>
      </div>
    </div>
  );
}
