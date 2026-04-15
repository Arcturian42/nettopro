import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we're in Next.js build data collection phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.VERCEL_ENV === 'production' && !process.env.VERCEL_URL;

// Create a mock PrismaClient that returns empty data for build phase
function createMockPrismaClient(): PrismaClient {
  const handler = {
    get() {
      return () => Promise.resolve([]);
    },
  };
  return new Proxy({} as PrismaClient, handler);
}

function createPrismaClient(): PrismaClient {
  // During build phase, return a mock client
  if (isBuildPhase || !process.env.DATABASE_URL) {
    console.log('[Prisma] Using mock client for build phase');
    return createMockPrismaClient();
  }

  // Runtime client with adapter
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const { PrismaClient: PrismaClientCtor } = require('@prisma/client');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  
  return new PrismaClientCtor({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
