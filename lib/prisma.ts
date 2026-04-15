import type { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Lazy initialization - client is only created when first accessed
function getClient(): PrismaClient {
  if (global.prisma) return global.prisma;
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const { PrismaClient: PrismaClientCtor } = require('@prisma/client');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  
  const client = new PrismaClientCtor({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = client;
  }
  
  return client;
}

// Export a Proxy that lazy-loads the client on first property access
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getClient();
    return (client as any)[prop];
  },
});
