# NettoPro — Plan d'Implémentation Phase 1

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Construire la plateforme NettoPro (annuaire B2B nettoyage commercial) avec Next.js 15, Supabase, Prisma, et shadcn/ui.

**Architecture:** App Next.js 15 avec App Router, SSR pour SEO, base de données PostgreSQL via Supabase, authentification avec NextAuth.js, UI avec Tailwind + shadcn/ui.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Prisma, Supabase (PostgreSQL), NextAuth.js, Zod, React Hook Form.

---

## Phase 1 — Jour 1: Setup, DB, Layout, Composants Base

### Task 1.1: Initialiser le projet Next.js 15

**Objective:** Créer le projet Next.js avec shadcn/ui et la structure de base.

**Files:**
- Create: All project files via CLI

**Step 1: Initialize project**

```bash
cd ~/NettoPro
echo "my-app" | npx shadcn@latest init --yes --template next --base-color slate
```

**Step 2: Move files to root**

```bash
mv my-app/* .
mv my-app/.* . 2>/dev/null || true
rmdir my-app
```

**Step 3: Install additional deps**

```bash
npm install @prisma/client prisma next-auth react-hook-form @hookform/resolvers zod lucide-react
npm install -D @types/node
```

**Step 4: Init Prisma**

```bash
npx prisma init
```

**Step 5: Commit**

```bash
git init
git add .
git commit -m "chore: init Next.js 15 project with shadcn/ui"
```

---

### Task 1.2: Configurer le schéma Prisma

**Objective:** Définir le schéma de base de données complet.

**Files:**
- Create: `prisma/schema.prisma`

**Step 1: Write schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(USER)
  accounts      Account[]
  sessions      Session[]
  company       Company?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Company {
  id                String           @id @default(cuid())
  siret             String           @unique
  name              String
  slug              String           @unique
  description       String?          @db.Text
  shortDescription  String?          @db.VarChar(160)
  logo              String?
  website           String?
  email             String?
  phone             String?
  whatsapp          String?
  address           String?
  city              String?
  postalCode        String?
  region            Region?
  latitude          Float?
  longitude         Float?
  googleMapsUrl     String?
  googleReviews     Int?
  googleRating      Float?
  facebookUrl       String?
  linkedinUrl       String?
  instagramUrl      String?
  youtubeUrl        String?
  certifications    Certification[]
  categories        Category[]
  gallery           String[]
  videoUrl          String?
  isClaimed         Boolean          @default(false)
  claimedBy         String?          @unique
  claimedAt         DateTime?
  isPremium         Boolean          @default(false)
  premiumUntil      DateTime?
  status            CompanyStatus    @default(PENDING)
  viewCount         Int              @default(0)
  clickCount        Int              @default(0)
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  user              User?            @relation(fields: [claimedBy], references: [id])
  
  @@index([region])
  @@index([status])
  @@index([isClaimed])
  @@index([categories])
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?   @db.Text
  icon        String?
  order       Int       @default(0)
  companies   Company[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Certification {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?   @db.Text
  logo        String?
  companies   Company[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?  @db.VarChar(300)
  content     String   @db.Text
  coverImage  String?
  category    ArticleCategory @default(GUIDE)
  status      ArticleStatus   @default(DRAFT)
  publishedAt DateTime?
  author      String?
  viewCount   Int      @default(0)
  metaTitle   String?  @db.VarChar(60)
  metaDesc    String?  @db.VarChar(160)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([status])
  @@index([category])
  @@index([publishedAt])
}

enum UserRole {
  USER
  ADMIN
}

enum CompanyStatus {
  PENDING
  ACTIVE
  REJECTED
}

enum Region {
  AUVERGNE_RHONE_ALPES
  BOURGOGNE_FRANCHE_COMTE
  BRETAGNE
  CENTRE_VAL_DE_LOIRE
  CORSE
  GRAND_EST
  HAUTS_DE_FRANCE
  ILE_DE_FRANCE
  NORMANDIE
  NOUVELLE_AQUITAINE
  OCCITANIE
  PAYS_DE_LA_LOIRE
  PROVENCE_ALPES_COTE_D_AZUR
}

enum ArticleCategory {
  GUIDE
  NEWS
  INTERVIEW
  REGULATION
  MARKET
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

**Step 2: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma schema with Company, Category, Article models"
```

---

### Task 1.3: Configurer les variables d'environnement

**Objective:** Créer le fichier .env.local avec les variables nécessaires.

**Files:**
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Create .env.local**

```bash
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nettopro"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# OAuth (à configurer plus tard)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Supabase (à configurer après création projet)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
EOF
```

**Step 2: Create .env.example**

```bash
cp .env.local .env.example
```

**Step 3: Commit**

```bash
git add .env.local .env.example
git commit -m "chore: add environment configuration"
```

---

### Task 1.4: Créer le layout principal et navigation

**Objective:** Mettre en place le layout de base avec header et footer.

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/components/Header.tsx`
- Create: `app/components/Footer.tsx`
- Create: `lib/utils.ts` (already exists from shadcn, verify)

**Step 1: Update layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NettoPro - Annuaire des entreprises de nettoyage professionnel",
  description: "Trouvez les meilleures entreprises de nettoyage commercial en France. Annuaire B2B spécialisé pour facility managers et directeurs achats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

**Step 2: Create Header.tsx**

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Search, Building2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Annuaire", href: "/annuaire" },
  { name: "Catégories", href: "/categories" },
  { name: "Régions", href: "/regions" },
  { name: "Magazine", href: "/magazine" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NettoPro</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/rechercher">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/connexion">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Espace Pro
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="my-4" />
                <Link href="/rechercher" className="text-lg font-medium">
                  Rechercher
                </Link>
                <Link href="/connexion" className="text-lg font-medium">
                  Espace Pro
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

**Step 3: Create Footer.tsx**

```tsx
import Link from "next/link";

const footerLinks = {
  annuaire: [
    { name: "Toutes les entreprises", href: "/annuaire" },
    { name: "Par catégorie", href: "/categories" },
    { name: "Par région", href: "/regions" },
    { name: "Ajouter mon entreprise", href: "/inscription" },
  ],
  ressources: [
    { name: "Magazine", href: "/magazine" },
    { name: "Guides d'achat", href: "/magazine/guides" },
    { name: "Actualités", href: "/magazine/actualites" },
    { name: "Réglementation", href: "/magazine/reglementation" },
  ],
  entreprise: [
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              NettoPro
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              L'annuaire de référence des entreprises de nettoyage professionnel en France.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Annuaire</h3>
            <ul className="space-y-2">
              {footerLinks.annuaire.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NettoPro. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Header and Footer components with navigation"
```

---

### Task 1.5: Créer la page d'accueil (Hero + Sections)

**Objective:** Créer une page d'accueil engageante avec recherche et sections clés.

**Files:**
- Create: `app/page.tsx`
- Create: `app/components/Hero.tsx`
- Create: `app/components/CategoryGrid.tsx`
- Create: `app/components/RegionGrid.tsx`

**Step 1: Create Hero.tsx**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Trouvez le prestataire de nettoyage idéal pour votre entreprise
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            L'annuaire de référence des entreprises de nettoyage professionnel en France. 
            Plus de 10 000 prestataires référencés.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une entreprise..."
                className="pl-10 h-12"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ville ou région..."
                className="pl-10 h-12"
              />
            </div>
            <Link href="/annuaire">
              <Button size="lg" className="h-12 px-8">
                Rechercher
              </Button>
            </Link>
          </div>
          
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
```

**Step 2: Create CategoryGrid.tsx**

```tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Stethoscope, 
  Factory, 
  Hammer, 
  Bus, 
  PartyPopper,
  Home,
  Utensils,
  Car
} from "lucide-react";

const categories = [
  { name: "Bureaux & Coworking", slug: "bureaux", icon: Building2, count: 2450 },
  { name: "Milieu médical", slug: "medical", icon: Stethoscope, count: 890 },
  { name: "Industrie & Entrepôts", slug: "industrie", icon: Factory, count: 1200 },
  { name: "Chantier & BTP", slug: "chantier", icon: Hammer, count: 750 },
  { name: "Transport & Véhicules", slug: "transport", icon: Bus, count: 560 },
  { name: "Événementiel", slug: "evenementiel", icon: PartyPopper, count: 420 },
  { name: "Copropriété & Résidentiel", slug: "copropriete", icon: Home, count: 1800 },
  { name: "Restauration & HORECA", slug: "restauration", icon: Utensils, count: 980 },
  { name: "Automobile & Garage", slug: "automobile", icon: Car, count: 340 },
];

export function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explorez par catégorie</h2>
          <p className="text-muted-foreground">
            Trouvez le spécialiste adapté à votre secteur d'activité
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/annuaire?categorie=${category.slug}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <category.icon className="h-8 w-8 mb-4 text-primary" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} entreprises</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/categories" className="text-primary hover:underline font-medium">
            Voir toutes les catégories →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create RegionGrid.tsx**

```tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const regions = [
  { name: "Île-de-France", slug: "ile-de-france", count: 4200 },
  { name: "Auvergne-Rhône-Alpes", slug: "auvergne-rhone-alpes", count: 1850 },
  { name: "Provence-Alpes-Côte d'Azur", slug: "provence-alpes-cote-d-azur", count: 1400 },
  { name: "Occitanie", slug: "occitanie", count: 1100 },
  { name: "Hauts-de-France", slug: "hauts-de-france", count: 980 },
  { name: "Grand Est", slug: "grand-est", count: 890 },
  { name: "Nouvelle-Aquitaine", slug: "nouvelle-aquitaine", count: 850 },
  { name: "Pays de la Loire", slug: "pays-de-la-loire", count: 720 },
];

export function RegionGrid() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Parcourez par région</h2>
          <p className="text-muted-foreground">
            Trouvez des prestataires de nettoyage près de chez vous
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.map((region) => (
            <Link key={region.slug} href={`/annuaire?region=${region.slug}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-1">{region.name}</h3>
                  <p className="text-sm text-muted-foreground">{region.count} entreprises</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/regions" className="text-primary hover:underline font-medium">
            Voir toutes les régions →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Update page.tsx**

```tsx
import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { RegionGrid } from "./components/RegionGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <RegionGrid />
    </>
  );
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add homepage with Hero, CategoryGrid, and RegionGrid"
```

---

## Phase 2 — Jour 2: Annuaire, Profils, Pages SEO

### Task 2.1: Configurer Prisma Client et types

**Objective:** Créer le singleton Prisma client et les types partagés.

**Files:**
- Create: `lib/prisma.ts`
- Create: `types/index.ts`

**Step 1: Create lib/prisma.ts**

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Step 2: Create types/index.ts**

```ts
import { Company, Category, Certification, Region, Article, ArticleCategory, ArticleStatus } from '@prisma/client';

export type CompanyWithRelations = Company & {
  categories: Category[];
  certifications: Certification[];
};

export type CategoryWithCount = Category & {
  _count: {
    companies: number;
  };
};

export type ArticleWithMetadata = Article & {
  category: ArticleCategory;
  status: ArticleStatus;
};

export interface SearchFilters {
  query?: string;
  region?: Region;
  category?: string;
  certification?: string;
  city?: string;
}

export const REGION_LABELS: Record<Region, string> = {
  AUVERGNE_RHONE_ALPES: "Auvergne-Rhône-Alpes",
  BOURGOGNE_FRANCHE_COMTE: "Bourgogne-Franche-Comté",
  BRETAGNE: "Bretagne",
  CENTRE_VAL_DE_LOIRE: "Centre-Val de Loire",
  CORSE: "Corse",
  GRAND_EST: "Grand Est",
  HAUTS_DE_FRANCE: "Hauts-de-France",
  ILE_DE_FRANCE: "Île-de-France",
  NORMANDIE: "Normandie",
  NOUVELLE_AQUITAINE: "Nouvelle-Aquitaine",
  OCCITANIE: "Occitanie",
  PAYS_DE_LA_LOIRE: "Pays de la Loire",
  PROVENCE_ALPES_COTE_D_AZUR: "Provence-Alpes-Côte d'Azur",
};

export const CATEGORY_ICONS: Record<string, string> = {
  bureaux: "Building2",
  medical: "Stethoscope",
  industrie: "Factory",
  chantier: "Hammer",
  transport: "Bus",
  evenementiel: "PartyPopper",
  copropriete: "Home",
  restauration: "Utensils",
  automobile: "Car",
};
```

**Step 3: Commit**

```bash
git add lib/prisma.ts types/index.ts
git commit -m "feat: add Prisma client singleton and shared types"
```

---

### Task 2.2: Créer la page annuaire avec filtres

**Objective:** Créer la page d'annuaire avec recherche et filtres.

**Files:**
- Create: `app/annuaire/page.tsx`
- Create: `app/annuaire/components/CompanyCard.tsx`
- Create: `app/annuaire/components/SearchFilters.tsx`
- Create: `app/annuaire/components/Pagination.tsx`

**Step 1: Create CompanyCard.tsx**

```tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, ExternalLink } from "lucide-react";
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
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                {company.isPremium && (
                  <Badge variant="default" className="flex-shrink-0">
                    <Star className="h-3 w-3 mr-1" />
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
                {company.categories.slice(0, 3).map((cat) => (
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
```

**Step 2: Create SearchFilters.tsx**

```tsx
"use client";

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
import { Region, REGION_LABELS } from "@/types";

const regions = Object.entries(REGION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const categories = [
  { value: "bureaux", label: "Bureaux & Coworking" },
  { value: "medical", label: "Milieu médical" },
  { value: "industrie", label: "Industrie & Entrepôts" },
  { value: "chantier", label: "Chantier & BTP" },
  { value: "transport", label: "Transport & Véhicules" },
  { value: "evenementiel", label: "Événementiel" },
  { value: "copropriete", label: "Copropriété" },
  { value: "restauration", label: "Restauration" },
  { value: "automobile", label: "Automobile" },
];

export function SearchFilters() {
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
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
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
```

**Step 3: Create Pagination.tsx**

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link href={getPageUrl(currentPage - 1)}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </Button>
      </Link>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>

      <Link href={getPageUrl(currentPage + 1)}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
```

**Step 4: Create page.tsx**

```tsx
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "./components/CompanyCard";
import { SearchFilters } from "./components/SearchFilters";
import { Pagination } from "./components/Pagination";
import { Region } from "@/types";

const ITEMS_PER_PAGE = 20;

interface SearchPageProps {
  searchParams: {
    q?: string;
    region?: string;
    categorie?: string;
    page?: string;
  };
}

export const metadata: Metadata = {
  title: "Annuaire des entreprises de nettoyage | NettoPro",
  description: "Trouvez les meilleures entreprises de nettoyage professionnel en France. Filtrez par région, catégorie et services.",
};

export default async function AnnuairePage({ searchParams }: SearchPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: any = {
    status: "ACTIVE",
  };

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { city: { contains: searchParams.q, mode: "insensitive" } },
      { siret: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  if (searchParams.region) {
    where.region = searchParams.region.toUpperCase().replace(/-/g, "_") as Region;
  }

  if (searchParams.categorie) {
    where.categories = {
      some: {
        slug: searchParams.categorie,
      },
    };
  }

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        categories: true,
        certifications: true,
      },
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: [
        { isPremium: "desc" },
        { name: "asc" },
      ],
    }),
    prisma.company.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Build base URL for pagination
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.region) params.set("region", searchParams.region);
  if (searchParams.categorie) params.set("categorie", searchParams.categorie);
  const baseUrl = `/annuaire${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Annuaire des entreprises de nettoyage</h1>
        <p className="text-muted-foreground">
          {totalCount} entreprises référencées
        </p>
      </div>

      <SearchFilters />

      <div className="mt-8 space-y-4">
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune entreprise trouvée pour ces critères.</p>
          </div>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add annuaire page with search filters and pagination"
```

---

### Task 2.3: Créer la page profil entreprise

**Objective:** Créer la page détaillée d'une entreprise.

**Files:**
- Create: `app/annuaire/[slug]/page.tsx`
- Create: `app/annuaire/[slug]/components/CompanyHeader.tsx`
- Create: `app/annuaire/[slug]/components/CompanyInfo.tsx`
- Create: `app/annuaire/[slug]/components/ContactSection.tsx`

**Step 1: Create page.tsx**

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompanyHeader } from "./components/CompanyHeader";
import { CompanyInfo } from "./components/CompanyInfo";
import { ContactSection } from "./components/ContactSection";
import { Button } from "@/components/ui/button";
import { BadgeCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

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
      title: "Entreprise non trouvée | NettoPro",
    };
  }

  return {
    title: `${company.name} - Entreprise de nettoyage | NettoPro`,
    description: company.shortDescription || `Découvrez ${company.name}, entreprise de nettoyage professionnel.`,
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

  return (
    <div className="container py-8">
      <CompanyHeader company={company} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <CompanyInfo company={company} />
        </div>
        
        <div className="space-y-6">
          <ContactSection company={company} />
          
          {!company.isClaimed ? (
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-start gap-3">
                <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">C'est votre entreprise ?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Réclamez gratuitement votre profil pour le personnaliser et recevoir des demandes.
                  </p>
                  <Link href={`/reclamer/${company.slug}`}>
                    <Button className="w-full">Réclamer ce profil</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 text-green-700">
                <BadgeCheck className="h-5 w-5" />
                <span className="font-medium">Profil vérifié</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Cette entreprise a réclamé et vérifié son profil.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create CompanyHeader.tsx**

```tsx
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
```

**Step 3: Create CompanyInfo.tsx**

```tsx
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
        <h2 className="text-xl font-semibold mb-4">À propos</h2>
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

      {/* Adresse complète */}
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
```

**Step 4: Create ContactSection.tsx**

```tsx
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { CompanyWithRelations } from "@/types";
import Link from "next/link";

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
        <Button className="w-full mt-6" size="lg" asChild>
          <a href={`tel:${company.phone}`}>
            <Phone className="h-4 w-4 mr-2" />
            Appeler maintenant
          </a>
        </Button>
      )}
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add company profile page with header, info, and contact sections"
```

---

### Task 2.4: Créer les pages SEO statiques (catégories et régions)

**Objective:** Générer les pages SEO pour chaque catégorie et région.

**Files:**
- Create: `app/categories/page.tsx`
- Create: `app/categories/[slug]/page.tsx`
- Create: `app/regions/page.tsx`
- Create: `app/regions/[slug]/page.tsx`

**Step 1: Create categories listing page**

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  Stethoscope, 
  Factory, 
  Hammer, 
  Bus, 
  PartyPopper,
  Home,
  Utensils,
  Car
} from "lucide-react";

export const metadata: Metadata = {
  title: "Catégories de nettoyage professionnel | NettoPro",
  description: "Explorez les différentes catégories de nettoyage professionnel : bureaux, milieu médical, industrie, chantier, transport, événementiel...",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bureaux: Building2,
  medical: Stethoscope,
  industrie: Factory,
  chantier: Hammer,
  transport: Bus,
  evenementiel: PartyPopper,
  copropriete: Home,
  restauration: Utensils,
  automobile: Car,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Catégories de nettoyage professionnel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez le prestataire spécialisé dans votre secteur d'activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.slug] || Building2;
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {category.description}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        {category._count.companies} entreprises
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Create category detail page**

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/app/annuaire/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { REGION_LABELS } from "@/types";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: "Catégorie non trouvée | NettoPro" };
  }

  return {
    title: `${category.name} - Entreprises de nettoyage | NettoPro`,
    description: `Trouvez les meilleures entreprises de ${category.name.toLowerCase()}. Annuaire des spécialistes du nettoyage professionnel en France.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const companies = await prisma.company.findMany({
    where: {
      categories: { some: { slug: params.slug } },
      status: "ACTIVE",
    },
    include: {
      categories: true,
      certifications: true,
    },
    orderBy: [{ isPremium: "desc" }, { name: "asc" }],
    take: 50,
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/categories" className="hover:text-primary">
            Catégories
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {category.name}
        </h1>
        
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Filtres par région */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Filtrer par région :</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(REGION_LABELS).map(([key, label]) => (
            <Link key={key} href={`/annuaire?categorie=${params.slug}&region=${key.toLowerCase().replace(/_/g, "-")}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Liste des entreprises */}
      <div className="space-y-4">
        {companies.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Aucune entreprise référencée dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/annuaire?categorie=${params.slug}`}>
          <Badge variant="secondary" className="cursor-pointer text-sm py-2 px-4">
            Voir toutes les entreprises {category.name.toLowerCase()} →
          </Badge>
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Create regions listing page**

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { Region, REGION_LABELS } from "@/types";

export const metadata: Metadata = {
  title: "Entreprises de nettoyage par région | NettoPro",
  description: "Trouvez des prestataires de nettoyage professionnel dans votre région. Annuaire complet par région française.",
};

export default async function RegionsPage() {
  // Get company counts by region
  const companiesByRegion = await prisma.company.groupBy({
    by: ["region"],
    where: { status: "ACTIVE" },
    _count: { id: true },
  });

  const regionCounts = companiesByRegion.reduce((acc, curr) => {
    if (curr.region) {
      acc[curr.region] = curr._count.id;
    }
    return acc;
  }, {} as Record<string, number>);

  const regions = Object.entries(REGION_LABELS).map(([key, label]) => ({
    slug: key.toLowerCase().replace(/_/g, "-"),
    key: key as Region,
    label,
    count: regionCounts[key] || 0,
  }));

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Entreprises de nettoyage par région
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez un prestataire de nettoyage professionnel près de chez vous
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <Link key={region.key} href={`/regions/${region.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{region.label}</h2>
                    <p className="text-sm font-medium">
                      {region.count} entreprise{region.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Create region detail page**

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/app/annuaire/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { Region, REGION_LABELS } from "@/types";

const SLUG_TO_REGION: Record<string, Region> = {
  "auvergne-rhone-alpes": "AUVERGNE_RHONE_ALPES",
  "bourgogne-franche-comte": "BOURGOGNE_FRANCHE_COMTE",
  "bretagne": "BRETAGNE",
  "centre-val-de-loire": "CENTRE_VAL_DE_LOIRE",
  "corse": "CORSE",
  "grand-est": "GRAND_EST",
  "hauts-de-france": "HAUTS_DE_FRANCE",
  "ile-de-france": "ILE_DE_FRANCE",
  "normandie": "NORMANDIE",
  "nouvelle-aquitaine": "NOUVELLE_AQUITAINE",
  "occitanie": "OCCITANIE",
  "pays-de-la-loire": "PAYS_DE_LA_LOIRE",
  "provence-alpes-cote-d-azur": "PROVENCE_ALPES_COTE_D_AZUR",
};

interface RegionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const region = SLUG_TO_REGION[params.slug];
  const regionName = region ? REGION_LABELS[region] : params.slug;

  return {
    title: `Entreprises de nettoyage ${regionName} | NettoPro`,
    description: `Trouvez les meilleures entreprises de nettoyage professionnel en ${regionName}. Devis gratuit et comparatif des prestataires.`,
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const region = SLUG_TO_REGION[params.slug];
  
  if (!region) {
    notFound();
  }

  const companies = await prisma.company.findMany({
    where: {
      region,
      status: "ACTIVE",
    },
    include: {
      categories: true,
      certifications: true,
    },
    orderBy: [{ isPremium: "desc" }, { name: "asc" }],
    take: 50,
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/regions" className="hover:text-primary">
            Régions
          </Link>
          <span>/</span>
          <span>{REGION_LABELS[region]}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Entreprises de nettoyage en {REGION_LABELS[region]}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Trouvez les meilleures entreprises de nettoyage professionnel en {REGION_LABELS[region]}. 
          Comparez les prestataires et obtenez des devis gratuits.
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Filtrer par catégorie :</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/annuaire?region=${params.slug}&categorie=${cat.slug}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Liste des entreprises */}
      <div className="space-y-4">
        {companies.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Aucune entreprise référencée dans cette région pour le moment.
            </p>
          </div>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/annuaire?region=${params.slug}`}>
          <Badge variant="secondary" className="cursor-pointer text-sm py-2 px-4">
            Voir toutes les entreprises en {REGION_LABELS[region]} →
          </Badge>
        </Link>
      </div>
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add SEO pages for categories and regions"
```

---

## Phase 3 — Jour 3: Auth, Claim Profile, Dashboard, Admin

### Task 3.1: Configurer NextAuth.js

**Objective:** Mettre en place l'authentification avec NextAuth.js.

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/providers.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create lib/auth.ts**

```ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
};
```

**Step 2: Install next-auth dependency**

```bash
npm install next-auth @next-auth/prisma-adapter
```

**Step 3: Create auth API route**

```tsx
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

**Step 4: Create providers.tsx**

```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Step 5: Update layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NettoPro - Annuaire des entreprises de nettoyage professionnel",
  description: "Trouvez les meilleures entreprises de nettoyage commercial en France. Annuaire B2B spécialisé pour facility managers et directeurs achats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

**Step 6: Create types/next-auth.d.ts**

```ts
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat: configure NextAuth.js with Google provider"
```

---

### Task 3.2: Créer les pages d'authentification

**Objective:** Créer les pages de connexion et inscription.

**Files:**
- Create: `app/connexion/page.tsx`
- Create: `app/inscription/page.tsx`

**Step 1: Create connexion page**

```tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | NettoPro",
  description: "Connectez-vous à votre espace professionnel NettoPro",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <LoginForm />
    </div>
  );
}
```

**Step 2: Create LoginForm.tsx**

```tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace professionnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/tableau-de-bord" })}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Vous n'avez pas de compte ?
            </span>
          </div>
        </div>

        <Link href="/inscription">
          <Button variant="outline" className="w-full">
            Créer un compte professionnel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create inscription page**

```tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "./components/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription | NettoPro",
  description: "Créez votre compte professionnel sur NettoPro",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <RegisterForm />
    </div>
  );
}
```

**Step 4: Create RegisterForm.tsx**

```tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function RegisterForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez NettoPro pour gérer votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/tableau-de-bord" })}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Déjà inscrit ?
            </span>
          </div>
        </div>

        <Link href="/connexion">
          <Button variant="outline" className="w-full">
            Se connecter
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add login and register pages with Google OAuth"
```

---

### Task 3.3: Créer le système de claim profile

**Objective:** Créer le système permettant aux entreprises de réclamer leur profil.

**Files:**
- Create: `app/reclamer/[slug]/page.tsx`
- Create: `app/api/claim/route.ts`

**Step 1: Create claim API route**

```tsx
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { companySlug } = await req.json();

    if (!companySlug) {
      return NextResponse.json(
        { error: "Company slug is required" },
        { status: 400 }
      );
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Check if already claimed
    if (company.isClaimed) {
      return NextResponse.json(
        { error: "This profile has already been claimed" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has a company
    const existingCompany = await prisma.company.findUnique({
      where: { claimedBy: user.id },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "You have already claimed a profile" },
        { status: 400 }
      );
    }

    // Claim the company
    await prisma.company.update({
      where: { id: company.id },
      data: {
        isClaimed: true,
        claimedBy: user.id,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Step 2: Create claim page**

```tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ClaimForm } from "./components/ClaimForm";

interface ClaimPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ClaimPageProps): Promise<Metadata> {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
  });

  return {
    title: `Réclamer ${company?.name || "ce profil"} | NettoPro`,
  };
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/connexion?callbackUrl=/reclamer/${params.slug}`);
  }

  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
  });

  if (!company) {
    notFound();
  }

  if (company.isClaimed) {
    redirect(`/annuaire/${params.slug}?error=already-claimed`);
  }

  return (
    <div className="container max-w-2xl py-12">
      <ClaimForm company={company} />
    </div>
  );
}
```

**Step 3: Create ClaimForm.tsx**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, CheckCircle, AlertTriangle } from "lucide-react";
import { Company } from "@prisma/client";

interface ClaimFormProps {
  company: Company;
}

export function ClaimForm({ company }: ClaimFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companySlug: company.slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/tableau-de-bord");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profil réclamé avec succès !</h2>
          <p className="text-muted-foreground">
            Vous allez être redirigé vers votre tableau de bord...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          Réclamer ce profil
        </CardTitle>
        <CardDescription>
          Confirmez que vous êtes bien le propriétaire de cette entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-semibold text-lg">{company.name}</h3>
          {company.siret && (
            <p className="text-sm text-muted-foreground">SIRET: {company.siret}</p>
          )}
          {company.address && (
            <p className="text-sm text-muted-foreground mt-1">{company.address}</p>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">En réclamant ce profil, vous pourrez :</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Modifier les informations de votre entreprise
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Ajouter votre logo et vos photos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Ajouter vos certifications
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Recevoir des demandes de contact
            </li>
          </ul>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Traitement en cours..." : "Confirmer et réclamer ce profil"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          En cliquant sur ce bouton, vous certifiez être autorisé à représenter cette entreprise.
        </p>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add claim profile system with API and UI"
```

---

### Task 3.4: Créer le dashboard entreprise

**Objective:** Créer le tableau de bord pour les entreprises ayant réclamé leur profil.

**Files:**
- Create: `app/tableau-de-bord/page.tsx`
- Create: `app/tableau-de-bord/components/CompanyStats.tsx`
- Create: `app/tableau-de-bord/components/CompanyEditForm.tsx`
- Create: `app/api/company/route.ts`

**Step 1: Create dashboard page**

```tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanyStats } from "./components/CompanyStats";
import { CompanyEditForm } from "./components/CompanyEditForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tableau de bord | NettoPro",
  description: "Gérez votre entreprise sur NettoPro",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      company: {
        include: {
          categories: true,
          certifications: true,
        },
      },
    },
  });

  if (!user?.company) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas encore réclamé de profil. Trouvez votre entreprise dans l'annuaire pour la réclamer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const categories = await prisma.category.findMany();
  const certifications = await prisma.certification.findMany();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Gérez votre profil et suivez vos statistiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CompanyEditForm 
            company={user.company} 
            allCategories={categories}
            allCertifications={certifications}
          />
        </div>
        <div>
          <CompanyStats company={user.company} />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create CompanyStats.tsx**

```tsx
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
    </div>
  );
}
```

**Step 3: Create CompanyEditForm.tsx (simplified version)**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Company, Category, Certification } from "@prisma/client";
import { Check, X } from "lucide-react";

interface CompanyEditFormProps {
  company: Company & { categories: Category[]; certifications: Certification[] };
  allCategories: Category[];
  allCertifications: Certification[];
}

export function CompanyEditForm({ company, allCategories, allCertifications }: CompanyEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: company.name,
    shortDescription: company.shortDescription || "",
    description: company.description || "",
    phone: company.phone || "",
    email: company.email || "",
    website: company.website || "",
    address: company.address || "",
    city: company.city || "",
    postalCode: company.postalCode || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update");

      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'entreprise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Description courte (max 160 caractères)</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                maxLength={160}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description complète</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Create company API route**

```tsx
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!user?.company) {
      return NextResponse.json({ error: "No company found" }, { status: 404 });
    }

    const data = await req.json();

    const updated = await prisma.company.update({
      where: { id: user.company.id },
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add company dashboard with stats and edit form"
```

---

### Task 3.5: Créer l'admin dashboard

**Objective:** Créer un panneau d'administration pour gérer les entreprises et articles.

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `middleware.ts`

**Step 1: Create middleware.ts**

```ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Admin only routes
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/tableau-de-bord/:path*", "/reclamer/:path*"],
};
```

**Step 2: Create admin layout**

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Administration</h1>
        <Link href="/">
          <Button variant="outline">Retour au site</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start">
              Tableau de bord
            </Button>
          </Link>
          <Link href="/admin/entreprises">
            <Button variant="ghost" className="w-full justify-start">
              Entreprises
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button variant="ghost" className="w-full justify-start">
              Articles
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" className="w-full justify-start">
              Catégories
            </Button>
          </Link>
        </nav>
        
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
```

**Step 3: Create admin dashboard page**

```tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Users, Eye } from "lucide-react";

export default async function AdminPage() {
  const [companyCount, articleCount, userCount, totalViews] = await Promise.all([
    prisma.company.count(),
    prisma.article.count(),
    prisma.user.count(),
    prisma.company.aggregate({ _sum: { viewCount: true } }),
  ]);

  const pendingCompanies = await prisma.company.count({
    where: { status: "PENDING" },
  });

  const stats = [
    {
      title: "Entreprises",
      value: companyCount,
      subtitle: `${pendingCompanies} en attente`,
      icon: Building2,
    },
    {
      title: "Articles",
      value: articleCount,
      subtitle: "publiés",
      icon: FileText,
    },
    {
      title: "Utilisateurs",
      value: userCount,
      subtitle: "inscrits",
      icon: Users,
    },
    {
      title: "Vues totales",
      value: totalViews._sum.viewCount || 0,
      subtitle: "sur tous les profils",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Vue d'ensemble</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin dashboard with overview stats and protected routes"
```

---

### Task 3.6: Configuration déploiement Vercel

**Objective:** Configurer le projet pour le déploiement sur Vercel.

**Files:**
- Create: `vercel.json`
- Create: `next.config.js`
- Modify: `package.json`

**Step 1: Update next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
```

**Step 2: Create vercel.json**

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Step 3: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

**Step 4: Add .vercelignore**

```
.env.local
node_modules
```

**Step 5: Commit and prepare for deployment**

```bash
git add .
git commit -m "chore: configure Vercel deployment"
```

---

## Phase 4 — Semaine 2: Agents VPS (Overview)

Cette phase sera développée après le déploiement initial. Elle comprend:

### Agent de Scraping (Node.js + BullMQ)
- Intégration API SIRENE
- Scraping Google Maps via Serper.dev
- Normalisation et géocodage

### Agent de Publication
- Publication automatique des entreprises validées
- Génération de slugs et SEO

### Agent Éditorial (Claude API)
- Génération de 4 articles/semaine
- Publication automatique

### Agent Email (AgentMail)
- Séquences d'emails pour les entreprises
- Relances automatiques

### Agent Monitoring
- Healthchecks système
- Alertes Telegram

---

## Summary

This plan covers:
- **Jour 1**: Project setup, database schema, layout, base components, homepage
- **Jour 2**: Directory with search/filters, company profiles, SEO pages for categories/regions
- **Jour 3**: Authentication, claim profile system, company dashboard, admin panel, Vercel config
- **Semaine 2**: VPS agents for automation (overview)

Ready to execute using subagent-driven-development skill.
