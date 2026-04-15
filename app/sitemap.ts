import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://nettopro-alpha.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/annuaire`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/connexion`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/inscription`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/outils`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/outils/test-prime-renove`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/outils/test-cee`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/outils/calculateur-aides`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/regions`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/tableau-de-bord`, lastModified: new Date(), priority: 0.6 },
  ];

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

  // Dynamic pages - Regions
  const regions = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const regionPages = regions.map((region) => ({
    url: `${BASE_URL}/regions/${region.slug}`,
    lastModified: region.updatedAt || new Date(),
    priority: 0.7,
  }));

  // Dynamic pages - Categories
  const categoryPages = regions.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: cat.updatedAt || new Date(),
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...companyPages,
    ...regionPages,
    ...categoryPages,
  ];
}
