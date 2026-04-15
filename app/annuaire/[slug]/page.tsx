import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompanyHeader } from "./components/CompanyHeader";
import { CompanyInfo } from "./components/CompanyInfo";
import { ContactSection } from "./components/ContactSection";
import { LeadForm } from "./components/LeadForm";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CompanyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: { categories: true },
  });

  if (!company) {
    return {
      title: "Entreprise non trouvee | NettoPro",
    };
  }

  return {
    title: `${company.name} - Entreprise de nettoyage | NettoPro`,
    description: company.shortDescription || `Decouvrez ${company.name}, entreprise de nettoyage professionnel.`,
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: {
      categories: true,
      certifications: true,
    },
  });

  if (!company) {
    notFound();
  }

  // Increment view count
  await prisma.company.update({
    where: { id: company.id },
    data: { viewCount: { increment: 1 } },
  });

  // JSON-LD structured data for LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://nettopro.vercel.app/annuaire/${company.slug}`,
    "name": company.name,
    "description": company.shortDescription || company.description,
    "url": `https://nettopro.vercel.app/annuaire/${company.slug}`,
    "telephone": company.phone,
    "email": company.email,
    "address": company.address ? {
      "@type": "PostalAddress",
      "streetAddress": company.address,
      "addressLocality": company.city,
      "postalCode": company.postalCode,
      "addressRegion": company.region,
      "addressCountry": "FR",
    } : undefined,
    "aggregateRating": company.googleRating ? {
      "@type": "AggregateRating",
      "ratingValue": company.googleRating,
      "reviewCount": company.googleReviews,
    } : undefined,
    "image": company.logo,
    "sameAs": [
      company.website,
      company.facebookUrl,
      company.linkedinUrl,
      company.instagramUrl,
    ].filter(Boolean),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container py-8">
        <CompanyHeader company={company} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <CompanyInfo company={company} />
          </div>
          
          <div className="space-y-6">
            <LeadForm companyId={company.id} companyName={company.name} />
            <ContactSection company={company} />
            
            {!company.isClaimed ? (
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">C&apos;est votre entreprise ?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reclamez gratuitement votre profil pour le personnaliser et recevoir des demandes.
                    </p>
                    <Link href={`/reclamer/${company.slug}`}>
                      <Button className="w-full">Reclamer ce profil</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 text-green-700">
                  <BadgeCheck className="h-5 w-5" />
                  <span className="font-medium">Profil verifie</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Cette entreprise a reclame et verifie son profil.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
