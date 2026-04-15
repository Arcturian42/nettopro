import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Create a separate Prisma client for NextAuth (without adapter pattern)
// This avoids conflicts with Prisma 7's adapter pattern used in lib/prisma.ts
const globalForPrismaAuth = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

// Lazy init for Prisma client - only create when needed
// This prevents build-time errors when DATABASE_URL is not available
function getPrismaAuth() {
  if (globalForPrismaAuth.prismaAuth) {
    return globalForPrismaAuth.prismaAuth;
  }
  
  // During build, return a mock if no DATABASE_URL
  if (!process.env.DATABASE_URL && process.env.VERCEL_ENV === 'production') {
    // This is a build-time mock - auth won't work without DB
    return {} as PrismaClient;
  }
  
  const client = new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrismaAuth.prismaAuth = client;
  }
  return client;
}

const prismaAuth = getPrismaAuth();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaAuth),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  session: {
    strategy: "database",
  },
};
