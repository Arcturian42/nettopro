import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

// This endpoint fixes slugs with missing accents (rnovation -> renovation)
export async function POST(req: NextRequest) {
  const prisma = getPrismaClient();
  // Simple auth check - in production use proper admin auth
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = {
      companies: [] as any[],
      categories: [] as any[],
      certifications: [] as any[],
      articles: [] as any[],
    };

    // Fix Companies
    const companies = await prisma.company.findMany();
    for (const company of companies) {
      const correctSlug = slugify(company.name);
      if (correctSlug !== company.slug) {
        // Check if new slug already exists
        const existing = await prisma.company.findUnique({
          where: { slug: correctSlug },
        });
        if (!existing) {
          await prisma.company.update({
            where: { id: company.id },
            data: { slug: correctSlug },
          });
          results.companies.push({
            id: company.id,
            name: company.name,
            oldSlug: company.slug,
            newSlug: correctSlug,
          });
        }
      }
    }

    // Fix Categories
    const categories = await prisma.category.findMany();
    for (const category of categories) {
      const correctSlug = slugify(category.name);
      if (correctSlug !== category.slug) {
        const existing = await prisma.category.findUnique({
          where: { slug: correctSlug },
        });
        if (!existing) {
          await prisma.category.update({
            where: { id: category.id },
            data: { slug: correctSlug },
          });
          results.categories.push({
            id: category.id,
            name: category.name,
            oldSlug: category.slug,
            newSlug: correctSlug,
          });
        }
      }
    }

    // Fix Certifications
    const certifications = await prisma.certification.findMany();
    for (const cert of certifications) {
      const correctSlug = slugify(cert.name);
      if (correctSlug !== cert.slug) {
        const existing = await prisma.certification.findUnique({
          where: { slug: correctSlug },
        });
        if (!existing) {
          await prisma.certification.update({
            where: { id: cert.id },
            data: { slug: correctSlug },
          });
          results.certifications.push({
            id: cert.id,
            name: cert.name,
            oldSlug: cert.slug,
            newSlug: correctSlug,
          });
        }
      }
    }

    // Fix Articles
    const articles = await prisma.article.findMany();
    for (const article of articles) {
      const correctSlug = slugify(article.title);
      if (correctSlug !== article.slug) {
        const existing = await prisma.article.findUnique({
          where: { slug: correctSlug },
        });
        if (!existing) {
          await prisma.article.update({
            where: { id: article.id },
            data: { slug: correctSlug },
          });
          results.articles.push({
            id: article.id,
            title: article.title,
            oldSlug: article.slug,
            newSlug: correctSlug,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Slugs fixed successfully",
      results,
    });
  } catch (error) {
    console.error("Error fixing slugs:", error);
    return NextResponse.json(
      { error: "Failed to fix slugs" },
      { status: 500 }
    );
  }
}
