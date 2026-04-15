import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient {
  // Return existing global instance
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Create new instance
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  
  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Cache in development for hot reload
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}

// Backward compatibility - but will throw if DATABASE_URL not set
export const prisma = globalForPrisma.prisma ?? getPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
