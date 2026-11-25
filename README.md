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
