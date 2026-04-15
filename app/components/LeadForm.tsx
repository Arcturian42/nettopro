'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const leadFormSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  projectType: z.array(z.string()).min(1, 'Sélectionnez au moins un type'),
  surface: z.number().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  city: z.string().optional(),
  description: z.string().optional(),
  budgetRange: z.string().optional(),
  timing: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadFormSchema>

const PROJECT_TYPES = [
  { id: 'isolation', label: 'Isolation (murs, combles, plancher)' },
  { id: 'pompe-chaleur', label: 'Pompe à chaleur / Climatisation' },
  { id: 'chaudiere', label: 'Chaudière / Poêle / Cheminée' },
  { id: 'menuiserie', label: 'Menuiserie (fenêtres, portes)' },
  { id: 'ventilation', label: 'Ventilation / VMC' },
  { id: 'panneaux-solaires', label: 'Panneaux solaires' },
  { id: 'audit-energetique', label: 'Audit énergétique' },
]

const BUDGET_RANGES = [
  { value: '5-10k', label: '5 000€ - 10 000€' },
  { value: '10-20k', label: '10 000€ - 20 000€' },
  { value: '20-50k', label: '20 000€ - 50 000€' },
  { value: '50k+', label: 'Plus de 50 000€' },
  { value: 'unknown', label: 'Je ne sais pas encore' },
]

const TIMING_OPTIONS = [
  { value: 'urgent', label: 'Dès que possible' },
  { value: '1-mois', label: "Dans le mois" },
  { value: '3-mois', label: 'Dans 3 mois' },
  { value: '6-mois', label: 'Dans 6 mois' },
  { value: '1-an', label: "Dans l'année" },
]

interface LeadFormProps {
  companyId: string
  companyName: string
}

export default function LeadForm({ companyId, companyName }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          companyId,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Erreur lors de l\'envoi')
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Demande envoyée !
        </h3>
        <p className="text-green-700 text-sm">
          {companyName} vous contactera rapidement pour évaluer votre projet.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-1">
        Demander un devis gratuit
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Remplissez ce formulaire, {companyName} vous rappelle sous 24h
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom *</label>
            <input
              {...register('firstName')}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Jean"
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs">{errors.firstName.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              {...register('lastName')}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Dupont"
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="jean.dupont@email.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="06 12 34 56 78"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Type de travaux *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROJECT_TYPES.map((type) => (
              <label key={type.id} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  value={type.id}
                  {...register('projectType')}
                  className="mt-0.5"
                />
                <span className="text-xs leading-tight">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.projectType && (
            <span className="text-red-500 text-xs">{errors.projectType.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Code postal *</label>
            <input
              {...register('postalCode')}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="75001"
              maxLength={5}
            />
            {errors.postalCode && (
              <span className="text-red-500 text-xs">{errors.postalCode.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Surface (m²)</label>
            <input
              {...register('surface', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Budget estimé</label>
            <select
              {...register('budgetRange')}
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">Sélectionner</option>
              {BUDGET_RANGES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Délai souhaité</label>
            <select
              {...register('timing')}
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">Sélectionner</option>
              {TIMING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description du projet
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border rounded-md text-sm resize-none"
            placeholder="Décrivez votre projet en quelques mots..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Gratuit et sans engagement
        </p>
      </form>
    </div>
  )
}
