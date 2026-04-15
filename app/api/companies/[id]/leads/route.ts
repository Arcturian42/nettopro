import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET: Lister les leads d'une entreprise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  // Vérifier que l'utilisateur est propriétaire ou admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const company = await prisma.company.findUnique({
    where: { id },
  })

  if (!company) {
    return NextResponse.json(
      { error: 'Entreprise non trouvée' },
      { status: 404 }
    )
  }

  if (user?.role !== 'ADMIN' && company.claimedBy !== user?.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const where = {
    companyId: id,
    ...(status && { status }),
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        projectType: true,
        postalCode: true,
        budgetRange: true,
        timing: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, limit, offset })
}

// GET: Stats leads
export async function HEAD(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  return NextResponse.json({})
}
