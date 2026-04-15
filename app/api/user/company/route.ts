import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getPrismaClient } from "@/lib/prisma";
import { authOptions } from '@/lib/auth'

export async function GET() {
  const prisma = getPrismaClient();
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  })

  if (!user?.company) {
    return NextResponse.json(
      { error: 'Aucune entreprise associée' },
      { status: 404 }
    )
  }

  return NextResponse.json({ company: user.company })
}
