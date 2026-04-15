import { MetadataRoute } from "next";

const BASE_URL = "https://nettopro-alpha.vercel.app";

// Force dynamic to avoid DB connection at build time
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamic import to avoid loading Prisma at build time
  const { prisma } = await import("@/lib/prisma");
  
  // Static pages
  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/annuaire`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/connexion`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/inscription`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/inscription/success`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/outils`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/outils/test-prime-renove`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/outils/test-cee`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/outils/calculateur-aides`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/regions`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/tableau-de-bord`, lastModified: new Date(), priority: 0.6 },
  ];

  try {
    // Dynamic pages - Companies
    const companies = await prisma.company.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    const companyPages = companies.map((company) => ({
      url: `${BASE_URL}/annuaire/${company.slug}`,
      lastModified: company.updatedAt,
      priority: 0.8,
    }));

    // Dynamic pages - Categories
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const categoryPages = categories.map((cat) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      priority: 0.7,
    }));

    // Regions from categories (using same data structure)
    const regionPages = categories.map((cat) => ({
      url: `${BASE_URL}/regions/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      priority: 0.7,
    }));

    return [
      ...staticPages,
      ...companyPages,
      ...categoryPages,
      ...regionPages,
    ];
  } catch (error) {
    // If DB is not available, return only static pages
    console.warn("Could not fetch dynamic pages for sitemap:", error);
    return staticPages;
  }
}
