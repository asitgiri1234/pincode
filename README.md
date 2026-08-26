# Pincode Explorer

A Bangalore pincode explorer with a React interface and a small Node API.

## Run locally

Install dependencies:

```bash
npm install
```

Start the API and the frontend together:

```bash
npm start
```

Open the local URL printed by Vite (http://localhost:5173 unless the port is taken).

The frontend calls the API through a relative `/api` path, which Vite proxies to the
API in both `dev` and `preview`. Set `API_PORT` if port 3000 is already in use.

To run the two processes separately instead:

```bash
npm run api   # API on http://localhost:3000
npm run dev   # frontend
```

Search the API directly with:

```text
http://localhost:3000/api/pincodes?query=Whitefield
```

## Searching

A query matches, in this order of priority:

1. an exact area, post office or alias name - `Whitefield`, `Kormangala`
2. a pincode or pincode prefix - `560066`, `56010`
3. a partial name - `nagar`, `layout`
4. a district, city or state - `Bengaluru Urban`

Matching ignores case, punctuation and accents, so `HSR-Layout` and `hsr layout` are
equivalent. District matches need at least three characters so a single letter does not
return the whole dataset.

## Quality checks

```bash
npm run test
npm run lint
npm run build
```

The current dataset covers Bangalore areas in Bengaluru Urban District and includes common aliases for searching.
