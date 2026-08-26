import { bangalorePincodes, type BangalorePincode } from '../data/bangalorePincodes.ts'

/** Shortest query that may match a district or city name, so a stray letter does not return everything. */
const MIN_REGION_QUERY_LENGTH = 3

export function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('en-IN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lower ranks are shown first. */
const MatchRank = {
  ExactName: 0,
  Pincode: 1,
  PartialName: 2,
  Region: 3,
  None: 4,
} as const

type MatchRank = (typeof MatchRank)[keyof typeof MatchRank]

function rankLocation(location: BangalorePincode, normalizedQuery: string): MatchRank {
  const searchableNames = [location.area, location.postOffice, ...location.aliases].map(
    normalizeSearchValue,
  )

  if (searchableNames.some((name) => name === normalizedQuery)) {
    return MatchRank.ExactName
  }

  if (location.pincode.startsWith(normalizedQuery.replace(/\s/g, ''))) {
    return MatchRank.Pincode
  }

  if (searchableNames.some((name) => name.includes(normalizedQuery))) {
    return MatchRank.PartialName
  }

  const regions = [location.district, location.city, location.state].map(normalizeSearchValue)

  if (
    normalizedQuery.length >= MIN_REGION_QUERY_LENGTH &&
    regions.some((region) => region.includes(normalizedQuery))
  ) {
    return MatchRank.Region
  }

  return MatchRank.None
}

export function searchBangalorePincodes(query: string): BangalorePincode[] {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  return bangalorePincodes
    .map((location, index) => ({ location, index, rank: rankLocation(location, normalizedQuery) }))
    .filter((match) => match.rank !== MatchRank.None)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((match) => match.location)
}
