import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const leadSchema = z.object({
  companyId: z.string(),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  projectType: z.array(z.string()).min(1, 'Sélectionnez au moins un type de travaux'),
  surface: z.number().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  city: z.string().optional(),
  description: z.string().optional(),
  budgetRange: z.string().optional(),
  timing: z.string().optional(),
  source: z.enum(['WEBSITE', 'WIDGET']).default('WEBSITE'),
})

// POST: Créer un nouveau lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = leadSchema.parse(body)

    // Vérifier que l'entreprise existe et est active
    const company = await prisma.company.findUnique({
      where: { id: validated.companyId },
    })

    if (!company || company.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Entreprise non trouvée ou inactive' },
        { status: 404 }
      )
    }

    // Créer le lead
    const lead = await prisma.lead.create({
      data: {
        companyId: validated.companyId,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        projectType: validated.projectType,
        surface: validated.surface,
        postalCode: validated.postalCode,
        city: validated.city,
        description: validated.description,
        budgetRange: validated.budgetRange,
        timing: validated.timing,
        source: validated.source,
      },
    })

    // TODO: Envoyer notification email à l'entreprise
    // TODO: Envoyer confirmation au prospect

    return NextResponse.json(
      { success: true, lead: { id: lead.id } },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
