"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    
    const url = params.toString() 
      ? `/annuaire?${params.toString()}` 
      : "/annuaire";
    
    router.push(url);
  };

  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Trouvez le prestataire de nettoyage idéal pour votre entreprise
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            L&apos;annuaire de référence des entreprises de nettoyage professionnel en France. 
            Plus de 10 000 prestataires référencés.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une entreprise..."
                className="pl-10 h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ville ou région..."
                className="pl-10 h-12"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Rechercher
            </Button>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>Populaire :</span>
            <Link href="/annuaire?region=ile-de-france" className="hover:text-primary underline">
              Île-de-France
            </Link>
            <Link href="/annuaire?categorie=bureaux" className="hover:text-primary underline">
              Nettoyage de bureaux
            </Link>
            <Link href="/annuaire?categorie=medical" className="hover:text-primary underline">
              Milieu médical
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
