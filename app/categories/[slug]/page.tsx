import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPrismaClient } from "@/lib/prisma";
import { CompanyCard } from "@/app/annuaire/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { REGION_LABELS } from "@/types";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const prisma = getPrismaClient();
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: "Catégorie non trouvée | NettoPro" };
  }

  return {
    title: `${category.name} - Entreprises de nettoyage | NettoPro`,
    description: `Trouvez les meilleures entreprises de ${category.name.toLowerCase()}. Annuaire des spécialistes du nettoyage professionnel en France.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const prisma = getPrismaClient();
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const companies = await prisma.company.findMany({
    where: {
      categories: { some: { slug: params.slug } },
      status: "ACTIVE",
    },
    include: {
      categories: true,
      certifications: true,
    },
    orderBy: [{ isPremium: "desc" }, { name: "asc" }],
    take: 50,
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/categories" className="hover:text-primary">
            Catégories
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {category.name}
        </h1>
        
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Filtres par région */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Filtrer par région :</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(REGION_LABELS).map(([key, label]) => (
            <Link key={key} href={`/annuaire?categorie=${params.slug}&region=${key.toLowerCase().replace(/_/g, "-")}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Liste des entreprises */}
      <div className="space-y-4">
        {companies.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Aucune entreprise référencée dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/annuaire?categorie=${params.slug}`}>
          <Badge variant="secondary" className="cursor-pointer text-sm py-2 px-4">
            Voir toutes les entreprises {category.name.toLowerCase()} →
          </Badge>
        </Link>
      </div>
    </div>
  );
}
