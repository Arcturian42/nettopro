import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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

const categories = [
  { name: "Bureaux & Coworking", slug: "bureaux", icon: Building2, count: 2450 },
  { name: "Milieu médical", slug: "medical", icon: Stethoscope, count: 890 },
  { name: "Industrie & Entrepôts", slug: "industrie", icon: Factory, count: 1200 },
  { name: "Chantier & BTP", slug: "chantier", icon: Hammer, count: 750 },
  { name: "Transport & Véhicules", slug: "transport", icon: Bus, count: 560 },
  { name: "Événementiel", slug: "evenementiel", icon: PartyPopper, count: 420 },
  { name: "Copropriété & Résidentiel", slug: "copropriete", icon: Home, count: 1800 },
  { name: "Restauration & HORECA", slug: "restauration", icon: Utensils, count: 980 },
  { name: "Automobile & Garage", slug: "automobile", icon: Car, count: 340 },
];

export function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explorez par catégorie</h2>
          <p className="text-muted-foreground">
            Trouvez le spécialiste adapté à votre secteur d&apos;activité
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/annuaire?categorie=${category.slug}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <category.icon className="h-8 w-8 mb-4 text-primary" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} entreprises</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/categories" className="text-primary hover:underline font-medium">
            Voir toutes les catégories →
          </Link>
        </div>
      </div>
    </section>
  );
}
