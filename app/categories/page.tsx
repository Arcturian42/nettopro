import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  Stethoscope, 
  Factory, 
  Hammer, 
  Bus, 
  PartyPopper,
  Home,
  Utensils,
  Car
} from "lucide-react";

export const metadata: Metadata = {
  title: "Catégories de nettoyage professionnel | NettoPro",
  description: "Explorez les différentes catégories de nettoyage professionnel : bureaux, milieu médical, industrie, chantier, transport, événementiel...",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bureaux: Building2,
  medical: Stethoscope,
  industrie: Factory,
  chantier: Hammer,
  transport: Bus,
  evenementiel: PartyPopper,
  copropriete: Home,
  restauration: Utensils,
  automobile: Car,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Catégories de nettoyage professionnel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez le prestataire spécialisé dans votre secteur d&apos;activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.slug] || Building2;
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {category.description}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        {category._count.companies} entreprises
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
