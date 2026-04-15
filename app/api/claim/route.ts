import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(req: Request) {
  const prisma = getPrismaClient();
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
