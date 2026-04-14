import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Building2 } from "lucide-react";
import { CompanyWithRelations } from "@/types";

interface CompanyHeaderProps {
  company: CompanyWithRelations;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
            {company.isPremium && (
              <Badge variant="default">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Premium
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {company.city && company.region && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.city}, {company.region}
              </span>
            )}
            {company.siret && (
              <span>SIRET: {company.siret}</span>
            )}
          </div>
          
          {company.googleRating && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                <span className="font-bold text-green-700 mr-2">{company.googleRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(company.googleRating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({company.googleReviews} avis Google)
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {company.categories.map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
