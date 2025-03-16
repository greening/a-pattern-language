# A Pattern Language Index

This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It also has an
embedded [Sanity](https://www.sanity.io/) admin for managing content.

## Getting Started

First, add the required Sanity environment variables in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID="<project_id>"
NEXT_PUBLIC_SANITY_DATASET="<dataset>"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open [http://localhost:3000/studio](http://localhost:3000/studio) to view the admin

## Deploying

This is set up to deploy to Vercel. You can set up a new project through their admin or through the
CLI.

## Importing Pattern Data

Import the placeholder patterns to avoid reference errors, then the test subset into Sanity

```bash
npm install @sanity/cli
npx sanity@latest dataset import data/placeholder-patterns.ndjson production --replace
npx sanity@latest dataset import data/patterns111-253-complete.ndjson production --replace
```

Note: Replace `production` with your dataset name if different (e.g., `development`). The `--replace` flag will only replace documents with matching IDs and leave others untouched.

Then, run the development server:

```bash
npm run dev
```
