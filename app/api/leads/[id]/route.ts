import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { getPrismaClient } from "@/lib/prisma";
import { authOptions } from '@/lib/auth'

// GET: Récupérer un lead (vérifier propriété)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getPrismaClient();
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { company: true },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Lead non trouvé' }, { status: 404 })
  }

  // Vérifier que l'utilisateur est propriétaire de l'entreprise ou admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN' && lead.company.claimedBy !== user?.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // Marquer comme vu si nouveau
  if (lead.status === 'NEW') {
    await prisma.lead.update({
      where: { id },
      data: { status: 'VIEWED', viewedAt: new Date() },
    })
  }

  return NextResponse.json({ lead })
}

// PATCH: Mettre à jour le statut d'un lead
const updateSchema = z.object({
  status: z.enum(['VIEWED', 'CONTACTED', 'CONVERTED', 'LOST']).optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getPrismaClient();
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { company: true },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Lead non trouvé' }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN' && lead.company.claimedBy !== user?.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validated = updateSchema.parse(body)

    const updateData: Record<string, unknown> = {}

    if (validated.status) {
      updateData.status = validated.status
      if (validated.status === 'CONTACTED') {
        updateData.contactedAt = new Date()
      } else if (validated.status === 'CONVERTED') {
        updateData.convertedAt = new Date()
      }
    }

    if (validated.notes !== undefined) {
      updateData.notes = validated.notes
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, lead: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }
    throw error
  }
}
