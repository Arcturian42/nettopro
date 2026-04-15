'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  projectType: string[]
  postalCode: string
  budgetRange: string | null
  timing: string | null
  status: 'NEW' | 'VIEWED' | 'CONTACTED' | 'CONVERTED' | 'LOST'
  createdAt: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: 'Consulté', color: 'bg-gray-100 text-gray-700' },
  CONTACTED: { label: 'Contacté', color: 'bg-yellow-100 text-yellow-700' },
  CONVERTED: { label: 'Converti', color: 'bg-green-100 text-green-700' },
  LOST: { label: 'Perdu', color: 'bg-red-100 text-red-700' },
}

const BUDGET_LABELS: Record<string, string> = {
  '5-10k': '5 000€ - 10 000€',
  '10-20k': '10 000€ - 20 000€',
  '20-50k': '20 000€ - 50 000€',
  '50k+': 'Plus de 50 000€',
  unknown: 'Non défini',
}

export default function LeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetchCompany()
    }
  }, [session])

  const fetchCompany = async () => {
    try {
      const res = await fetch('/api/user/company')
      if (res.ok) {
        const data = await res.json()
        setCompanyId(data.company.id)
        fetchLeads(data.company.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchLeads = async (cid: string) => {
    try {
      const url = filter === 'ALL' 
        ? `/api/companies/${cid}/leads`
        : `/api/companies/${cid}/leads?status=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus as Lead['status'] } : l))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="p-8">Chargement...</div>
  }

  const newLeadsCount = leads.filter(l => l.status === 'NEW').length

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mes demandes de devis</h1>
        <p className="text-gray-600">
          {newLeadsCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              {newLeadsCount} nouveau{newLeadsCount > 1 ? 'x' : ''}
            </span>
          )}
          {leads.length} demande{leads.length > 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'NEW', 'VIEWED', 'CONTACTED', 'CONVERTED'].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f)
              if (companyId) fetchLeads(companyId)
            }}
            className={`px-3 py-1.5 text-sm rounded-full transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'ALL' ? 'Tous' : STATUS_LABELS[f]?.label || f}
          </button>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-3">📤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Aucune demande pour le moment
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Complétez votre fiche entreprise pour apparaître dans les résultats de recherche et recevoir des demandes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white border rounded-lg p-5 shadow-sm ${
                lead.status === 'NEW' ? 'border-blue-300 ring-1 ring-blue-100' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[lead.status].color}`}>
                  {STATUS_LABELS[lead.status].label}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium">{lead.email}</p>
                </div>
                {lead.phone && (
                  <div>
                    <span className="text-gray-500">Téléphone</span>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Code postal</span>
                  <p className="font-medium">{lead.postalCode}</p>
                </div>
                {lead.budgetRange && (
                  <div>
                    <span className="text-gray-500">Budget</span>
                    <p className="font-medium">{BUDGET_LABELS[lead.budgetRange]}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <span className="text-gray-500 text-sm">Type de travaux</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {lead.projectType.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                >
                  Contacter par email
                </a>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-green-700 transition"
                  >
                    Appeler
                  </a>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {lead.status !== 'CONTACTED' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'CONTACTED')}
                    className="text-xs px-3 py-1.5 border rounded hover:bg-gray-50"
                  >
                    Marquer comme contacté
                  </button>
                )}
                {lead.status !== 'CONVERTED' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'CONVERTED')}
                    className="text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded hover:bg-green-50"
                  >
                    Converti en client
                  </button>
                )}
                {lead.status !== 'LOST' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'LOST')}
                    className="text-xs px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50"
                  >
                    Perdu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
