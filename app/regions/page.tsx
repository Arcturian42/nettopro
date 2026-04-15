import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getPrismaClient } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { Region, REGION_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entreprises de nettoyage par région | NettoPro",
  description: "Trouvez des prestataires de nettoyage professionnel dans votre région. Annuaire complet par région française.",
};

export default async function RegionsPage() {
  const prisma = getPrismaClient();
  // Get company counts by region
  const companiesByRegion = await prisma.company.groupBy({
    by: ["region"],
    where: { status: "ACTIVE" },
    _count: { id: true },
  });

  const regionCounts = companiesByRegion.reduce((acc, curr) => {
    if (curr.region) {
      acc[curr.region] = curr._count.id;
    }
    return acc;
  }, {} as Record<string, number>);

  const regions = Object.entries(REGION_LABELS).map(([key, label]) => ({
    slug: key.toLowerCase().replace(/_/g, "-"),
    key: key as Region,
    label,
    count: regionCounts[key] || 0,
  }));

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Entreprises de nettoyage par région
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez un prestataire de nettoyage professionnel près de chez vous
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <Link key={region.key} href={`/regions/${region.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{region.label}</h2>
                    <p className="text-sm font-medium">
                      {region.count} entreprise{region.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
