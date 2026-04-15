import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Leaf, Euro, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Outils de simulation | NettoPro",
  description: "Simulateurs gratuits pour estimer vos aides et primes pour le nettoyage professionnel et la rénovation énergétique.",
};

const tools = [
  {
    id: "test-prime-renove",
    title: "Simulateur Prime Rénov'",
    description: "Estimez vos aides pour la rénovation énergétique de vos locaux professionnels. Calculez en quelques clics le montant des primes auxquelles vous êtes éligible.",
    icon: Calculator,
    href: "/outils/test-prime-renove",
    color: "bg-blue-500/10 text-blue-600",
    available: true,
  },
  {
    id: "test-cee",
    title: "Simulateur CEE",
    description: "Calculez le montant des Certificats d'Économie d'Énergie pour vos travaux de rénovation. Découvrez comment financer vos projets énergétiques.",
    icon: Leaf,
    href: "/outils/test-cee",
    color: "bg-green-500/10 text-green-600",
    available: true,
  },
  {
    id: "calculateur-aides",
    title: "Calculateur global d'aides",
    description: "Un simulateur complet qui regroupe toutes les aides disponibles : Prime Rénov' + CEE en une seule estimation. Le calcul le plus complet disponible.",
    icon: Euro,
    href: "/outils/calculateur-aides",
    color: "bg-amber-500/10 text-amber-600",
    available: true,
  },
];

export default function OutilsPage() {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Outils de simulation
        </h1>
        <p className="text-lg text-muted-foreground">
          Estimez gratuitement vos aides et primes pour la rénovation énergétique 
          de vos locaux professionnels.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.id} className={`flex flex-col ${!tool.available ? 'opacity-75' : ''}`}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {tool.available ? (
                  <Link href={tool.href} className="w-full">
                    <Button className="w-full">
                      Lancer le simulateur
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full" variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Bientôt disponible
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">
            Comment fonctionnent nos simulateurs ?
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
              <span>Répondez à quelques questions sur votre situation et vos projets</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
              <span>Notre algorithme calcule les aides auxquelles vous êtes éligible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
              <span>Recevez une estimation personnalisée et des conseils pour vos démarches</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Besoin d&apos;aide pour vos travaux de nettoyage ou rénovation ?
        </p>
        <Link href="/annuaire">
          <Button variant="outline" size="lg">
            Trouver un prestataire
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
