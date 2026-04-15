/**
 * Génère un slug URL-friendly à partir d'une chaîne de caractères
 * - Translittère les accents (é → e, ç → c, etc.)
 * - Remplace les espaces par des tirets
 * - Supprime les caractères spéciaux
 * - Convertit en minuscules
 */

const transliterationMap: Record<string, string> = {
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
  'ç': 'c',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ñ': 'n',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'æ': 'ae', 'œ': 'oe',
  // Majuscules
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
  'Ç': 'C',
  'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
  'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
  'Ñ': 'N',
  'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
  'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
  'Ý': 'Y',
  'Æ': 'AE', 'Œ': 'OE',
};

export function slugify(text: string): string {
  if (!text) return '';

  // Translittération des caractères accentués
  let slug = text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('');

  // Conversion en minuscules
  slug = slug.toLowerCase();

  // Remplacement des espaces et caractères de ponctuation par des tirets
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')  // Remplace tout ce qui n'est pas alphanumérique par -
    .replace(/^-+|-+$/g, '')       // Supprime les tirets au début et à la fin
    .replace(/-+/g, '-');          // Évite les tirets multiples

  return slug;
}

/**
 * Génère un slug unique en ajoutant un nombre si nécessaire
 */
export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  let baseSlug = slugify(text);
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
