import { useState, type FormEvent } from 'react'
import './App.css'

type PincodeResult = {
  area: string
  pincode: string
  postOffice: string
  district: string
}

type SearchResponse = {
  count: number
  results: PincodeResult[]
}

const exampleAreas = ['Whitefield', 'Indiranagar', 'Koramangala', 'Electronic City']

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PincodeResult[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function search(queryToSearch: string) {
    const trimmedQuery = queryToSearch.trim()

    if (!trimmedQuery) {
      setError('Enter an area, district or pincode to begin.')
      setResults([])
      setHasSearched(true)
      return
    }

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await fetch(`/api/pincodes?query=${encodeURIComponent(trimmedQuery)}`)

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? 'No matching pincode found.')
      }

      const searchResponse = (await response.json()) as SearchResponse
      setResults(searchResponse.results)
    } catch (requestError) {
      setResults([])
      setError(
        requestError instanceof TypeError
          ? 'Could not reach the pincode service. Start it with "npm run api" and try again.'
          : requestError instanceof Error
            ? requestError.message
            : 'The pincode service is unavailable.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void search(query)
  }

  return (
    <main className="explorer-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Pincode Explorer home">
          <span className="brand-mark">P</span>
          <span>Pincode Explorer</span>
        </a>
        <span className="location-tag">Bengaluru, Karnataka</span>
      </header>

      <section className="search-panel" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">LOCAL POSTAL DIRECTORY</p>
          <h1 id="page-title">Find the right pincode.</h1>
          <p className="intro-copy">
            Search Bangalore areas, aliases and districts to find their postal code in
            seconds. You can also look up an area by its pincode.
          </p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="area-search">Area, district or pincode</label>
          <div className="search-row">
            <input
              id="area-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Whitefield, Bengaluru Urban or 560066"
              autoComplete="off"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
              <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </form>

        <div className="examples" aria-label="Popular areas">
          <span>Popular:</span>
          {exampleAreas.map((area) => (
            <button
              type="button"
              key={area}
              onClick={() => {
                setQuery(area)
                void search(area)
              }}
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      <section className="results-section" aria-live="polite" aria-busy={isLoading}>
        <div className="results-heading">
          <div>
            <p className="eyebrow">SEARCH RESULTS</p>
            <h2>
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? 'location' : 'locations'} found`
                : 'Your results'}
            </h2>
          </div>
          {results.length > 0 && <span className="result-count">BANGALORE ONLY</span>}
        </div>

        {isLoading && <p className="status-message">Looking through the directory...</p>}
        {!isLoading && error && <p className="status-message error-message">{error}</p>}
        {!isLoading && !error && !hasSearched && (
          <p className="status-message">Search for an area above to see its pincode.</p>
        )}
        {!isLoading && !error && results.length > 0 && (
          <div className="results-grid">
            {results.map((result) => (
              <article className="result-card" key={`${result.area}-${result.pincode}`}>
                <div className="card-topline">
                  <span className="pin-dot" aria-hidden="true"></span>
                  <span>{result.district}</span>
                </div>
                <h3>{result.area}</h3>
                <p>{result.postOffice} Post Office</p>
                <strong>{result.pincode}</strong>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Postal information for Bengaluru Urban District - India</footer>
    </main>
  )
}

export default App
