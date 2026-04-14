import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "./components/CompanyCard";
import { SearchFilters } from "./components/SearchFilters";
import { Pagination } from "./components/Pagination";
import { Region, CompanyWithRelations } from "@/types";

const ITEMS_PER_PAGE = 20;

interface SearchPageProps {
  searchParams: {
    q?: string;
    region?: string;
    categorie?: string;
    page?: string;
  };
}

export const metadata: Metadata = {
  title: "Annuaire des entreprises de nettoyage | NettoPro",
  description: "Trouvez les meilleures entreprises de nettoyage professionnel en France. Filtrez par région, catégorie et services.",
};

// Force dynamic rendering since this page requires database access
export const dynamic = 'force-dynamic';

export default async function AnnuairePage({ searchParams }: SearchPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: any = {
    status: "ACTIVE",
  };

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { city: { contains: searchParams.q, mode: "insensitive" } },
      { siret: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  if (searchParams.region) {
    where.region = searchParams.region.toUpperCase().replace(/-/g, "_") as Region;
  }

  if (searchParams.categorie) {
    where.categories = {
      some: {
        slug: searchParams.categorie,
      },
    };
  }

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        categories: true,
        certifications: true,
      },
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: [
        { isPremium: "desc" },
        { name: "asc" },
      ],
    }),
    prisma.company.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Build base URL for pagination
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.region) params.set("region", searchParams.region);
  if (searchParams.categorie) params.set("categorie", searchParams.categorie);
  const baseUrl = `/annuaire${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Annuaire des entreprises de nettoyage</h1>
        <p className="text-muted-foreground">
          {totalCount} entreprises référencées
        </p>
      </div>

      <SearchFilters />

      <div className="mt-8 space-y-4">
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune entreprise trouvée pour ces critères.</p>
          </div>
        ) : (
          companies.map((company: CompanyWithRelations) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}
