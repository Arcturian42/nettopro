import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/app/annuaire/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { Region, REGION_LABELS } from "@/types";

const SLUG_TO_REGION: Record<string, Region> = {
  "auvergne-rhone-alpes": "AUVERGNE_RHONE_ALPES",
  "bourgogne-franche-comte": "BOURGOGNE_FRANCHE_COMTE",
  "bretagne": "BRETAGNE",
  "centre-val-de-loire": "CENTRE_VAL_DE_LOIRE",
  "corse": "CORSE",
  "grand-est": "GRAND_EST",
  "hauts-de-france": "HAUTS_DE_FRANCE",
  "ile-de-france": "ILE_DE_FRANCE",
  "normandie": "NORMANDIE",
  "nouvelle-aquitaine": "NOUVELLE_AQUITAINE",
  "occitanie": "OCCITANIE",
  "pays-de-la-loire": "PAYS_DE_LA_LOIRE",
  "provence-alpes-cote-d-azur": "PROVENCE_ALPES_COTE_D_AZUR",
};

interface RegionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const region = SLUG_TO_REGION[params.slug];
  const regionName = region ? REGION_LABELS[region] : params.slug;

  return {
    title: `Entreprises de nettoyage ${regionName} | NettoPro`,
    description: `Trouvez les meilleures entreprises de nettoyage professionnel en ${regionName}. Devis gratuit et comparatif des prestataires.`,
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const region = SLUG_TO_REGION[params.slug];
  
  if (!region) {
    notFound();
  }

  const companies = await prisma.company.findMany({
    where: {
      region,
      status: "ACTIVE",
    },
    include: {
      categories: true,
      certifications: true,
    },
    orderBy: [{ isPremium: "desc" }, { name: "asc" }],
    take: 50,
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/regions" className="hover:text-primary">
            Régions
          </Link>
          <span>/</span>
          <span>{REGION_LABELS[region]}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Entreprises de nettoyage en {REGION_LABELS[region]}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Trouvez les meilleures entreprises de nettoyage professionnel en {REGION_LABELS[region]}. 
          Comparez les prestataires et obtenez des devis gratuits.
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Filtrer par catégorie :</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/annuaire?region=${params.slug}&categorie=${cat.slug}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {cat.name}
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
              Aucune entreprise référencée dans cette région pour le moment.
            </p>
          </div>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/annuaire?region=${params.slug}`}>
          <Badge variant="secondary" className="cursor-pointer text-sm py-2 px-4">
            Voir toutes les entreprises en {REGION_LABELS[region]} →
          </Badge>
        </Link>
      </div>
    </div>
  );
}
