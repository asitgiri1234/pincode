import { createServer, type ServerResponse } from 'node:http'
import { searchBangalorePincodes } from '../src/api/pincodeSearch.ts'

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3000)

function sendJson(response: ServerResponse, statusCode: number, body: object): void {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(body))
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)

  if (request.method !== 'GET' || requestUrl.pathname !== '/api/pincodes') {
    sendJson(response, 404, { error: 'Route not found' })
    return
  }

  const query = requestUrl.searchParams.get('query') ?? ''

  if (!query.trim()) {
    sendJson(response, 400, { error: 'The query parameter is required' })
    return
  }

  const results = searchBangalorePincodes(query)

  if (results.length === 0) {
    sendJson(response, 404, { error: 'No Bangalore pincode found for this search' })
    return
  }

  sendJson(response, 200, { query, count: results.length, results })
})

server.listen(port, () => {
  console.log(`Pincode API listening on http://localhost:${port}`)
})