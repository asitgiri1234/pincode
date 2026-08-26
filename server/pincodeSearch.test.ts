import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizeSearchValue, searchBangalorePincodes } from '../src/api/pincodeSearch.ts'

describe('Bangalore pincode search', () => {
  it('normalizes case, punctuation, and extra spaces', () => {
    assert.equal(normalizeSearchValue('  HSR-Layout  '), 'hsr layout')
  })

  it('finds an exact area match', () => {
    const results = searchBangalorePincodes('Whitefield')

    assert.equal(results[0]?.area, 'Whitefield')
    assert.equal(results[0]?.pincode, '560066')
  })

  it('finds an alias match', () => {
    const results = searchBangalorePincodes('Kormangala')

    assert.equal(results[0]?.area, 'Koramangala')
    assert.equal(results[0]?.pincode, '560034')
  })

  it('returns partial matches', () => {
    const results = searchBangalorePincodes('nagar')

    assert.ok(results.some((result) => result.area === 'Jayanagar'))
    assert.ok(results.some((result) => result.area === 'Rajajinagar'))
  })

  it('returns no results for an empty query', () => {
    assert.deepEqual(searchBangalorePincodes('   '), [])
  })
})