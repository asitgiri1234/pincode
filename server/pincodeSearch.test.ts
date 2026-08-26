import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { bangalorePincodes } from '../src/data/bangalorePincodes.ts'
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

  it('finds an area by its pincode', () => {
    const results = searchBangalorePincodes('560066')

    assert.equal(results.length, 1)
    assert.equal(results[0]?.area, 'Whitefield')
  })

  it('finds areas by a pincode prefix', () => {
    const results = searchBangalorePincodes('56010')

    assert.deepEqual(
      results.map((result) => result.pincode).sort(),
      ['560100', '560102'],
    )
  })

  it('finds every area in a district', () => {
    const results = searchBangalorePincodes('Bengaluru Urban')

    assert.equal(results.length, bangalorePincodes.length)
  })

  it('matches the post office name', () => {
    const results = searchBangalorePincodes('Malleswaram')

    assert.equal(results[0]?.area, 'Malleshwaram')
    assert.equal(results[0]?.pincode, '560003')
  })

  it('ranks an exact name above a partial one', () => {
    const results = searchBangalorePincodes('Jayanagar')

    assert.equal(results[0]?.area, 'Jayanagar')
  })

  it('ignores a one-letter query for district matching', () => {
    const results = searchBangalorePincodes('b')

    assert.ok(results.length < bangalorePincodes.length)
  })

  it('returns no results for a punctuation-only query', () => {
    assert.equal(normalizeSearchValue('!!!'), '')
    assert.deepEqual(searchBangalorePincodes('!!!'), [])
    assert.deepEqual(searchBangalorePincodes('---'), [])
  })

  it('returns no results for an unknown area', () => {
    assert.deepEqual(searchBangalorePincodes('Mumbai Andheri'), [])
  })
})