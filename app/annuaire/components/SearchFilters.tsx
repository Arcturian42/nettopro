"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Tag } from "lucide-react";

// Client-safe region labels (copied from types to avoid importing Prisma in client component)
const REGION_LABELS: Record<string, string> = {
  AUVERGNE_RHONE_ALPES: 'Auvergne-Rhône-Alpes',
  BOURGOGNE_FRANCHE_COMTE: 'Bourgogne-Franche-Comté',
  BRETAGNE: 'Bretagne',
  CENTRE_VAL_DE_LOIRE: 'Centre-Val de Loire',
  CORSE: 'Corse',
  GRAND_EST: 'Grand Est',
  HAUTS_DE_FRANCE: 'Hauts-de-France',
  ILE_DE_FRANCE: 'Île-de-France',
  NORMANDIE: 'Normandie',
  NOUVELLE_AQUITAINE: 'Nouvelle-Aquitaine',
  OCCITANIE: 'Occitanie',
  PAYS_DE_LA_LOIRE: 'Pays de la Loire',
  PROVENCE_ALPES_COTE_D_AZUR: "Provence-Alpes-Côte d'Azur",
};

const regions = Object.entries(REGION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface Category {
  slug: string;
  name: string;
}

interface SearchFiltersProps {
  categories: Category[];
}

// Inner component that uses useSearchParams
function SearchFiltersContent({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();
    const query = formData.get("query") as string;
    const region = formData.get("region") as string;
    const category = formData.get("category") as string;

    if (query) params.set("q", query);
    if (region && region !== "all") params.set("region", region);
    if (category && category !== "all") params.set("categorie", category);

    router.push(`/annuaire?${params.toString()}`);
  };

  return (
    <form action={handleSearch} className="bg-card border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="query"
            placeholder="Nom, ville, SIRET..."
            defaultValue={searchParams.get("q") || ""}
            className="pl-10"
          />
        </div>

        <Select name="region" defaultValue={searchParams.get("region") || "all"}>
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Toutes les régions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select name="category" defaultValue={searchParams.get("categorie") || "all"}>
          <SelectTrigger>
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="w-full">
          Rechercher
        </Button>
      </div>
    </form>
  );
}

// Loading fallback
function SearchFiltersSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

// Exported component with Suspense wrapper
export function SearchFilters({ categories }: SearchFiltersProps) {
  return (
    <Suspense fallback={<SearchFiltersSkeleton />}>
      <SearchFiltersContent categories={categories} />
    </Suspense>
  );
}
