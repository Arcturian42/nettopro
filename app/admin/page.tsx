import { getPrismaClient } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Users, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalCompanies,
    pendingCompanies,
    totalArticles,
    totalUsers,
    totalViews,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { status: "PENDING" } }),
    prisma.article.count(),
    prisma.user.count(),
    prisma.company.aggregate({
      _sum: { viewCount: true },
    }),
  ]);

  return {
    totalCompanies,
    pendingCompanies,
    totalArticles,
    totalUsers,
    totalViews: totalViews._sum.viewCount || 0,
  };
}

export default async function AdminPage() {
  const prisma = getPrismaClient();
  const stats = await getStats();

  const statCards = [
    {
      title: "Entreprises",
      value: stats.totalCompanies,
      icon: Building2,
      href: "/admin/entreprises",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Articles",
      value: stats.totalArticles,
      icon: FileText,
      href: "/admin/articles",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/utilisateurs",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Vues totales",
      value: stats.totalViews.toLocaleString("fr-FR"),
      icon: Eye,
      href: "/admin/entreprises",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Vue d&apos;ensemble
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur le tableau de bord d&apos;administration de NettoPro.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link href={stat.href}>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Voir tout
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Companies Alert */}
      {stats.pendingCompanies > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertCircle className="size-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">
                  Entreprises en attente
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  {stats.pendingCompanies} entreprise
                  {stats.pendingCompanies > 1 ? "s" : ""} en attente de
                  validation
                </p>
              </div>
              <Link href="/admin/entreprises?status=PENDING">
                <Button variant="outline" size="sm">
                  Gérer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/entreprises/nouveau">
            <Button>Ajouter une entreprise</Button>
          </Link>
          <Link href="/admin/articles/nouveau">
            <Button variant="outline">Créer un article</Button>
          </Link>
          <Link href="/admin/utilisateurs">
            <Button variant="outline">Gérer les utilisateurs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
