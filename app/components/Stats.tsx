import { prisma } from "@/lib/prisma";
import { Building2, MapPin, Tags } from "lucide-react";

export async function Stats() {
  const [companyCount, categoryCount, regionCount] = await Promise.all([
    prisma.company.count({ where: { status: "ACTIVE" } }),
    prisma.category.count(),
    prisma.company.groupBy({ by: ["region"] }).then((groups) => groups.length),
  ]);

  const stats = [
    { icon: Building2, value: companyCount, label: "entreprises référencées" },
    { icon: Tags, value: categoryCount, label: "catégories de services" },
    { icon: MapPin, value: regionCount, label: "régions couvertes" },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
              <p className="text-4xl font-bold mb-2">{stat.value.toLocaleString("fr-FR")}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
