import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export async function PUT(req: Request) {
  const prisma = getPrismaClient();
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
        facebookUrl: data.facebookUrl,
        linkedinUrl: data.linkedinUrl,
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

export async function GET() {
  const prisma = getPrismaClient();
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "No company found" }, { status: 404 });
    }

    return NextResponse.json(user.company);
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
