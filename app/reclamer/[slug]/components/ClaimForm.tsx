"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, CheckCircle, AlertTriangle } from "lucide-react";
import { Company } from "@prisma/client";

interface ClaimFormProps {
  company: Company;
}

export function ClaimForm({ company }: ClaimFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companySlug: company.slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/tableau-de-bord");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profil réclamé avec succès !</h2>
          <p className="text-muted-foreground">
            Vous allez être redirigé vers votre tableau de bord...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          Réclamer ce profil
        </CardTitle>
        <CardDescription>
          Confirmez que vous êtes bien le propriétaire de cette entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-semibold text-lg">{company.name}</h3>
          {company.siret && (
            <p className="text-sm text-muted-foreground">SIRET: {company.siret}</p>
          )}
          {company.address && (
            <p className="text-sm text-muted-foreground mt-1">{company.address}</p>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">En réclamant ce profil, vous pourrez :</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Modifier les informations de votre entreprise
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Ajouter votre logo et vos photos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Ajouter vos certifications
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Recevoir des demandes de contact
            </li>
          </ul>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Traitement en cours..." : "Confirmer et réclamer ce profil"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          En cliquant sur ce bouton, vous certifiez être autorisé à représenter cette entreprise.
        </p>
      </CardContent>
    </Card>
  );
}
