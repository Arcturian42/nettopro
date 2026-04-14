import { Badge } from "@/components/ui/badge";
import { CompanyWithRelations } from "@/types";

interface CompanyInfoProps {
  company: CompanyWithRelations;
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">A propos</h2>
        {company.description ? (
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-line">
              {company.description}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            Aucune description disponible pour cette entreprise.
          </p>
        )}
      </section>

      {/* Certifications */}
      {company.certifications.length > 0 && (
        <section className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {company.certifications.map((cert) => (
              <Badge key={cert.id} variant="outline" className="text-sm py-1 px-3">
                {cert.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Adresse complete */}
      {company.address && (
        <section className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Adresse</h2>
          <address className="not-italic text-muted-foreground">
            {company.address}
            <br />
            {company.postalCode} {company.city}
          </address>
        </section>
      )}
    </div>
  );
}
