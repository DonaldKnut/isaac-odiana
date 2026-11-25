import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Neon pooler + Next.js HMR: keep Prisma's client pool tiny so we don't starve the DB. */
function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    const usingPooler = url.hostname.includes("-pooler");

    if (usingPooler && !url.searchParams.has("pgbouncer")) {
      url.searchParams.set("pgbouncer", "true");
    }
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set(
        "connection_limit",
        process.env.NODE_ENV === "production" ? "5" : "1",
      );
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "15");
    }

    return url.toString();
  } catch {
    return raw;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
