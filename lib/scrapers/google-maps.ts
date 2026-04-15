/**
 * Scraper Google Maps pour récupérer avis, coordonnées, photos
 * Nécessite une clé API Google Places
 */

export interface GoogleMapsData {
  placeId?: string
  name?: string
  address?: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  reviews?: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
  latitude?: number
  longitude?: number
  photos?: string[]
  openingHours?: string[]
}

// Recherche par nom + localisation
export async function searchGoogleMaps(
  query: string,
  location?: { lat: number; lng: number },
  apiKey?: string
): Promise<GoogleMapsData[]> {
  if (!apiKey) {
    console.warn('Google Maps API key missing')
    return []
  }

  try {
    // Text Search
    const params = new URLSearchParams({
      query: query,
      key: apiKey,
    })
    if (location) {
      params.append('location', `${location.lat},${location.lng}`)
      params.append('radius', '50000')
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
    )

    if (!response.ok) return []

    const data = await response.json()
    
    return (data.results || []).map((place: Record<string, unknown>) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
    }))
  } catch (error) {
    console.error('Google Maps search error:', error)
    return []
  }
}

// Détails complets d'un lieu
export async function getPlaceDetails(
  placeId: string,
  apiKey?: string
): Promise<GoogleMapsData | null> {
  if (!apiKey) return null

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,geometry,photos,opening_hours',
      key: apiKey,
    })

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    )

    if (!response.ok) return null

    const data = await response.json()
    const place = data.result

    if (!place) return null

    return {
      placeId,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      reviews: place.reviews?.map((r: Record<string, unknown>) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        date: r.relative_time_description,
      })),
      photos: place.photos?.map((p: Record<string, unknown>) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${apiKey}`
      ),
      openingHours: place.opening_hours?.weekday_text,
    }
  } catch (error) {
    console.error('Google Maps details error:', error)
    return null
  }
}

// Géocoder une adresse
export async function geocodeAddress(
  address: string,
  apiKey?: string
): Promise<{ lat: number; lng: number } | null> {
  if (!apiKey) return null

  try {
    const params = new URLSearchParams({
      address,
      key: apiKey,
    })

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    )

    if (!response.ok) return null

    const data = await response.json()
    const location = data.results?.[0]?.geometry?.location

    if (!location) return null

    return { lat: location.lat, lng: location.lng }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
