import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { PrismaClient } from "@prisma/client";

const globalForPrismaAuth = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrismaAuth.prismaAuth) {
    return globalForPrismaAuth.prismaAuth;
  }
  
  // Dynamic import to avoid build-time initialization
  const { PrismaClient: PrismaClientCtor } = require("@prisma/client");
  const client = new PrismaClientCtor();
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrismaAuth.prismaAuth = client;
  }
  return client;
}

function getAdapter() {
  try {
    const { PrismaAdapter } = require("@next-auth/prisma-adapter");
    return PrismaAdapter(getPrismaClient());
  } catch (error) {
    console.error("Failed to initialize PrismaAdapter:", error);
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
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
