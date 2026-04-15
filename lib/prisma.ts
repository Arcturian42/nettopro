import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Mock Prisma client for build time
const createMockPrismaClient = (): PrismaClient => {
  const mockHandler = {
    get: () => mockHandler,
    apply: () => Promise.resolve([]),
  };
  return new Proxy({} as PrismaClient, mockHandler);
};

// Create Prisma client with pg adapter for PostgreSQL
const createPrismaClient = (): PrismaClient => {
  if (!process.env.DATABASE_URL) {
    // During build time or without DATABASE_URL, return a mock client
    console.warn('DATABASE_URL not set, using mock Prisma client');
    return createMockPrismaClient();
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return createMockPrismaClient();
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
