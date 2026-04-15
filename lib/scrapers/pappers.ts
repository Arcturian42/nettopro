/**
 * Scraper Pappers pour enrichir les données entreprise
 * Utilise l'API Pappers ou scraping si pas d'API key
 */

export interface PappersCompanyData {
  siret: string
  siren: string
  name: string
  legalForm?: string
  address?: string
  city?: string
  postalCode?: string
  activityCode?: string
  activityLabel?: string
  employees?: string
  revenue?: string
  creationDate?: string
  phone?: string
  email?: string
  website?: string
}

// API Pappers (nécessite une clé API)
export async function fetchFromPappersAPI(
  siret: string,
  apiKey: string
): Promise<PappersCompanyData | null> {
  try {
    const response = await fetch(
      `https://api.pappers.fr/v2/entreprise?siret=${siret}&api_token=${apiKey}`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) {
      console.error('Pappers API error:', response.status)
      return null
    }

    const data = await response.json()

    return {
      siret: data.siege?.siret || siret,
      siren: data.siren,
      name: data.nom_entreprise,
      legalForm: data.forme_juridique,
      address: data.siege?.adresse_ligne_1,
      city: data.siege?.ville,
      postalCode: data.siege?.code_postal,
      activityCode: data.code_naf,
      activityLabel: data.libelle_code_naf,
      employees: data.effectif,
      revenue: data.chiffre_affaires,
      creationDate: data.date_creation,
      phone: data.telephone,
      email: data.email,
      website: data.site_web,
    }
  } catch (error) {
    console.error('Pappers fetch error:', error)
    return null
  }
}

// Alternative: Scraping Pappers (sans API)
export async function scrapePappers(siret: string): Promise<PappersCompanyData | null> {
  try {
    const response = await fetch(`https://www.pappers.fr/entreprise/${siret}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    })

    if (!response.ok) return null

    const html = await response.text()

    // Extraction basique (regex) - à améliorer avec cheerio si besoin
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    const addressMatch = html.match(/adresse["']?\s*[:=]\s*["']([^"']+)/i)
    const cityMatch = html.match(/ville["']?\s*[:=]\s*["']([^"']+)/i)

    return {
      siret,
      siren: siret.slice(0, 9),
      name: nameMatch?.[1]?.trim() || 'Inconnu',
      address: addressMatch?.[1],
      city: cityMatch?.[1],
    }
  } catch (error) {
    console.error('Pappers scrape error:', error)
    return null
  }
}

// Recherche par nom/activité/région
export async function searchPappers(
  query: string,
  region?: string,
  apiKey?: string
): Promise<PappersCompanyData[]> {
  if (!apiKey) return []

  try {
    const params = new URLSearchParams({
      q: query,
      api_token: apiKey,
    })
    if (region) params.append('departement', region)

    const response = await fetch(
      `https://api.pappers.fr/v2/recherche?${params}`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) return []

    const data = await response.json()
    
    return (data.resultats || []).map((r: Record<string, unknown>) => ({
      siret: r.siret as string,
      siren: r.siren as string,
      name: r.nom_entreprise as string,
      city: r.ville as string,
      postalCode: r.code_postal as string,
      activityCode: r.code_naf as string,
      activityLabel: r.libelle_code_naf as string,
    }))
  } catch (error) {
    console.error('Pappers search error:', error)
    return []
  }
}
