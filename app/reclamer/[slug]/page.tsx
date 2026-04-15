import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ClaimForm } from "./components/ClaimForm";

interface ClaimPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ClaimPageProps): Promise<Metadata> {
  const prisma = getPrismaClient();
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
  });

  return {
    title: `Réclamer ${company?.name || "ce profil"} | NettoPro`,
  };
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const prisma = getPrismaClient();
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
