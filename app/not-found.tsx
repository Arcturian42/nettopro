"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        <div className="space-y-8">
          {/* 404 Code */}
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-3xl font-bold tracking-tight">
              Page introuvable
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">
                <Home className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/annuaire">
              <Button variant="outline" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Explorer l&apos;annuaire
              </Button>
            </Link>
          </div>

          {/* Back Link */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </Button>
          </div>

          {/* Popular Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Pages populaires :
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/annuaire?region=ile-de-france"
                className="text-sm text-primary hover:underline"
              >
                Île-de-France
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/categories"
                className="text-sm text-primary hover:underline"
              >
                Catégories
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/regions"
                className="text-sm text-primary hover:underline"
              >
                Régions
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/connexion"
                className="text-sm text-primary hover:underline"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
