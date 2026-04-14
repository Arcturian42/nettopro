import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, ExternalLink, Building2 } from "lucide-react";
import { CompanyWithRelations } from "@/types";
import Image from "next/image";

interface CompanyCardProps {
  company: CompanyWithRelations;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/annuaire/${company.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                {company.isPremium && (
                  <Badge variant="default" className="flex-shrink-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Premium
                  </Badge>
                )}
              </div>
              
              {company.shortDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {company.shortDescription}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3">
                {company.categories.slice(0, 3).map((cat: { id: string; name: string }) => (
                  <Badge key={cat.id} variant="secondary" className="text-xs">
                    {cat.name}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                {company.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.city}
                  </span>
                )}
                {company.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {company.phone}
                  </span>
                )}
              </div>
              
              {company.googleRating && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{company.googleRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({company.googleReviews} avis)
                  </span>
                </div>
              )}
            </div>
            
            <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
