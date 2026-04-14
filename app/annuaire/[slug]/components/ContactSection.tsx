import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { CompanyWithRelations } from "@/types";

interface ContactSectionProps {
  company: CompanyWithRelations;
}

export function ContactSection({ company }: ContactSectionProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Contact</h2>
      
      <div className="space-y-4">
        {company.phone && (
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>{company.phone}</span>
          </a>
        )}
        
        {company.whatsapp && (
          <a
            href={`https://wa.me/${company.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-green-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        )}
        
        {company.email && (
          <a
            href={`mailto:${company.email}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="truncate">{company.email}</span>
          </a>
        )}
        
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Globe className="h-5 w-5" />
            <span className="truncate">Site web</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        
        {company.googleMapsUrl && (
          <a
            href={company.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>Voir sur Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      
      {company.phone && (
        <a href={`tel:${company.phone}`} className="block mt-6">
          <Button className="w-full" size="lg">
            <Phone className="h-4 w-4 mr-2" />
            Appeler maintenant
          </Button>
        </a>
      )}
    </div>
  );
}
