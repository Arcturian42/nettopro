import { Company, Category, Certification, Article, Region, CompanyStatus, ArticleCategory, ArticleStatus, UserRole } from '@prisma/client';

// ============================================================================
// Prisma Model Types with Relations
// ============================================================================

export type CompanyWithRelations = Company & {
  categories: Category[];
  certifications: Certification[];
};

export type CategoryWithCount = Category & {
  _count: {
    companies: number;
  };
};

export type ArticleWithMetadata = Article & {
  readingTime?: number;
  formattedDate?: string;
};

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SearchFilters {
  query?: string;
  region?: Region;
  category?: string;
  certifications?: string[];
  hasWebsite?: boolean;
  hasSocialMedia?: boolean;
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'newest';
}

// ============================================================================
// Region Labels Mapping (13 French regions)
// ============================================================================

export const REGION_LABELS: Record<Region, string> = {
  AUVERGNE_RHONE_ALPES: 'Auvergne-Rhône-Alpes',
  BOURGOGNE_FRANCHE_COMTE: 'Bourgogne-Franche-Comté',
  BRETAGNE: 'Bretagne',
  CENTRE_VAL_DE_LOIRE: 'Centre-Val de Loire',
  CORSE: 'Corse',
  GRAND_EST: 'Grand Est',
  HAUTS_DE_FRANCE: 'Hauts-de-France',
  ILE_DE_FRANCE: 'Île-de-France',
  NORMANDIE: 'Normandie',
  NOUVELLE_AQUITAINE: 'Nouvelle-Aquitaine',
  OCCITANIE: 'Occitanie',
  PAYS_DE_LA_LOIRE: 'Pays de la Loire',
  PROVENCE_ALPES_COTE_D_AZUR: "Provence-Alpes-Côte d'Azur",
};

// ============================================================================
// Category Icons Mapping
// ============================================================================

export const CATEGORY_ICONS: Record<string, string> = {
  'bureaux': 'Building2',
  'commerces': 'Store',
  'industrie': 'Factory',
  'restauration': 'UtensilsCrossed',
  'sante': 'HeartPulse',
  'evenementiel': 'PartyPopper',
  'vitres': 'PanelTop',
  'fin-de-chantier': 'HardHat',
  'espaces-verts': 'Trees',
  'desinfection': 'ShieldCheck',
  'particuliers': 'Home',
  'coproprietes': 'Building',
};

// ============================================================================
// Re-export Prisma Enums for convenience
// ============================================================================

export { Region, CompanyStatus, ArticleCategory, ArticleStatus, UserRole };

// ============================================================================
// UI/Display Types
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SearchResult<T> {
  items: T[];
  pagination: PaginationMeta;
  facets?: {
    regions?: { value: Region; count: number }[];
    categories?: { value: string; count: number }[];
    certifications?: { value: string; count: number }[];
  };
}
