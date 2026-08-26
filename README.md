# Pincode Explorer

A Bangalore pincode explorer with a React interface and a small Node API.

## Run locally

Install dependencies:

```bash
npm install
```

Start the API in one terminal:

```bash
npm run api
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open the local URL printed by Vite. Search the API directly with:

```text
http://localhost:3000/api/pincodes?query=Whitefield
```

## Quality checks

```bash
npm run test
npm run lint
npm run build
```

The current dataset covers Bangalore areas in Bengaluru Urban District and includes common aliases for searching.
