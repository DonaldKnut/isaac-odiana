# Isaac Odiana — Digital Studio

Premium platform for music, books, podcasts, merchandise, announcements and tutoring.

## Stack

- **Frontend / API:** Next.js (App Router) + TypeScript + Tailwind
- **ORM / DB:** Prisma + PostgreSQL
- **Payments:** Stripe
- **Media:** Cloudinary
- **Email:** Resend

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or 3000).

Uses **PostgreSQL**. Local default: `postgresql://postgres:isaacdev@localhost:5432/isaac_odiana`. Or point `DATABASE_URL` at Neon/Supabase.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home |
| `/music` | Portfolio |
| `/books` | Bookstore |
| `/podcast` | Audio library |
| `/shop` | Merchandise |
| `/announcements` | Studio board (drops, mixtapes, episodes) |
| `/tutoring` | Session booking |
| `/admin` | Studio control |
| `/admin/announcements` | Publish announcements |
| `/admin/products` | Catalogue create / edit |
| `/admin/login` | Admin sign-in |

Guest commerce: shoppers and students never create accounts — checkout and booking use name + email only.

## Live checklist

1. **Neon** — `DATABASE_URL` on the pooler host (`…-pooler…`) with `pgbouncer=true&connection_limit=1`.
2. **Stripe** — set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`. Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`. In production, point the webhook at `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed`.
3. **Resend** — set `RESEND_API_KEY`, verify your domain, then set `RESEND_FROM_EMAIL` to e.g. `Isaac Odiana <hello@isaacodiana.com>` (not `onboarding@resend.dev`).
4. **Cloudinary** — required for admin uploads.
5. **App URL** — set `NEXT_PUBLIC_APP_URL` to the public origin (used for SEO + admin email links).
