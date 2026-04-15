import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Mail, ArrowRight, Search, Building2 } from "lucide-react";

export const metadata = {
  title: "Inscription confirm\u00e9e | NettoPro",
  description: "Votre compte NettoPro a \u00e9t\u00e9 cr\u00e9\u00e9 avec succ\u00e8s.",
};

export default function InscriptionSuccessPage() {
  return (
    <div className="container max-w-2xl py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Bienvenue sur NettoPro !</CardTitle>
          <CardDescription className="text-base">
            Votre compte a \u00e9t\u00e9 cr\u00e9\u00e9 avec succ\u00e8s.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Next Steps */}
          <div className="bg-muted rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Prochaines \u00e9tapes
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>V\u00e9rifiez votre bo\u00eete email pour confirmer votre adresse</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Compl\u00e9tez votre profil entreprise pour recevoir des demandes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>D\u00e9couvrez les demandes de devis pr\u00e8s de chez vous</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/tableau-de-bord" className="flex-1">
              <Button className="w-full" size="lg">
                <Building2 className="mr-2 h-4 w-4" />
                Compl\u00e9ter mon profil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/annuaire" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Explorer l&apos;annuaire
              </Button>
            </Link>
          </div>

          {/* Help Link */}
          <p className="text-sm text-muted-foreground">
            Une question ? Contactez-nous \u00e0{" "}
            <a href="mailto:support@nettopro.fr" className="text-primary hover:underline">
              support@nettopro.fr
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
