import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointer, Star, TrendingUp } from "lucide-react";
import { Company } from "@prisma/client";

interface CompanyStatsProps {
  company: Company;
}

export function CompanyStats({ company }: CompanyStatsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Statistiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Vues du profil</span>
            </div>
            <span className="font-semibold">{company.viewCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Clics contact</span>
            </div>
            <span className="font-semibold">{company.clickCount}</span>
          </div>
          
          {company.googleRating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Note Google</span>
              </div>
              <span className="font-semibold">{company.googleRating}/5</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Taux de conversion</span>
            </div>
            <span className="font-semibold">
              {company.viewCount > 0 
                ? `${Math.round((company.clickCount / company.viewCount) * 100)}%` 
                : "0%"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Statut du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Profil réclamé</span>
              <span className="text-green-600 font-medium">✓ Oui</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Visibilité premium</span>
              <span className={company.isPremium ? "text-green-600 font-medium" : "text-muted-foreground"}>
                {company.isPremium ? "✓ Actif" : "Non"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Statut</span>
              <span className="font-medium capitalize">{company.status.toLowerCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {company.premiumUntil && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Votre abonnement premium expire le{" "}
              <span className="font-medium text-foreground">
                {new Date(company.premiumUntil).toLocaleDateString("fr-FR")}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
