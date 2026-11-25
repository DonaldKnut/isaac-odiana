# Isaac Odiana — Digital Studio

Premium platform for music, books, podcasts, merchandise and tutoring.

## Stack

- **Frontend / API:** Next.js (App Router) + TypeScript + Tailwind
- **ORM / DB:** Prisma + PostgreSQL
- **Payments:** Stripe
- **Media:** Cloudinary (planned)

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or 3000), then `/books`, `/shop`, `/cart`, `/admin/products`.

Uses **PostgreSQL**. Local default: `postgresql://postgres:isaacdev@localhost:5432/isaac_odiana`. Or point `DATABASE_URL` at Neon/Supabase.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home |
| `/music` | Portfolio |
| `/books` | Bookstore |
| `/podcast` | Audio library |
| `/shop` | Merchandise |
| `/tutoring` | Session booking |
| `/admin` | Studio control |
