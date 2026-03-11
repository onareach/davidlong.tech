This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

**Local development (parallel architecture):** Copy `.env.example` to `.env.local` so the frontend proxies `/api/*` to your local backend. Then run `npm run dev` — no need to specify the API URL when starting.

```bash
cp .env.example .env.local
npm run dev
```

(Note: For local backend, run `python scripts/seed_test_user.py` in the backend repo to create a test user.)

**Production:** Without `.env.local`, rewrites proxy to Heroku. Vercel uses Heroku in production.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Troubleshooting

**"Failed to load today's entry" or 404 on /api/*:** Use the local backend for dev. Ensure `.env.local` exists (copy from `.env.example`) and the backend is running (`python app.py` in the backend repo).

**"Port 5000 is in use":** Another process (e.g. a previous backend) is using it. To free it: `lsof -i :5000` then `kill <PID>`. Or run the backend on another port and set `NEXT_PUBLIC_API_URL=http://localhost:5001` in `.env.local`.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
