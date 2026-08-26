import { bangalorePincodes, type BangalorePincode } from '../data/bangalorePincodes'

export function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('en-IN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
}

export function searchBangalorePincodes(query: string): BangalorePincode[] {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  const exactMatches: BangalorePincode[] = []
  const partialMatches: BangalorePincode[] = []

  for (const location of bangalorePincodes) {
    const searchableNames = [location.area, ...location.aliases].map(normalizeSearchValue)

    if (searchableNames.some((name) => name === normalizedQuery)) {
      exactMatches.push(location)
    } else if (searchableNames.some((name) => name.includes(normalizedQuery))) {
      partialMatches.push(location)
    }
  }

  return [...exactMatches, ...partialMatches]
}