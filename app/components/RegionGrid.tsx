import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const regions = [
  { name: "Île-de-France", slug: "ile-de-france", count: 4200 },
  { name: "Auvergne-Rhône-Alpes", slug: "auvergne-rhone-alpes", count: 1850 },
  { name: "Provence-Alpes-Côte d'Azur", slug: "provence-alpes-cote-d-azur", count: 1400 },
  { name: "Occitanie", slug: "occitanie", count: 1100 },
  { name: "Hauts-de-France", slug: "hauts-de-france", count: 980 },
  { name: "Grand Est", slug: "grand-est", count: 890 },
  { name: "Nouvelle-Aquitaine", slug: "nouvelle-aquitaine", count: 850 },
  { name: "Pays de la Loire", slug: "pays-de-la-loire", count: 720 },
];

export function RegionGrid() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Parcourez par région</h2>
          <p className="text-muted-foreground">
            Trouvez des prestataires de nettoyage près de chez vous
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.map((region) => (
            <Link key={region.slug} href={`/annuaire?region=${region.slug}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-1">{region.name}</h3>
                  <p className="text-sm text-muted-foreground">{region.count} entreprises</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/regions" className="text-primary hover:underline font-medium">
            Voir toutes les régions →
          </Link>
        </div>
      </div>
    </section>
  );
}
