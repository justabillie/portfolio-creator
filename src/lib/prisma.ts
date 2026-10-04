import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Retry a Prisma call on connection errors.
 * Neon's free tier auto-suspends after ~5 min idle; the first request
 * after a suspend fails and then wakes the DB.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  const delays = [2000, 5000]; // 2s, then 5s

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isConnError =
        msg.includes("Can't reach database server") ||
        msg.includes("Connection timed out") ||
        msg.includes("ECONNRESET") ||
        msg.includes("Connection terminated") ||
        msg.includes("the database system is starting up") ||
        msg.includes("Timed out fetching a new connection");

      if (!isConnError || attempt === delays.length) throw err;

      console.log(
        `[prisma] connection error, retry in ${delays[attempt]}ms (attempt ${attempt + 1})`
      );
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }

  throw new Error("withRetry exhausted");
}
