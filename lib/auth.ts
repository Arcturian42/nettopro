import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Create a separate Prisma client for NextAuth (without adapter pattern)
// This avoids conflicts with Prisma 7's adapter pattern used in lib/prisma.ts
const globalForPrismaAuth = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

// For Prisma 7, we need to use the adapter pattern or ensure DATABASE_URL is set
const prismaAuth = globalForPrismaAuth.prismaAuth ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaAuth.prismaAuth = prismaAuth;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaAuth),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
