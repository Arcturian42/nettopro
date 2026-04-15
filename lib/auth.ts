import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Dynamic adapter loading - only load PrismaAdapter when DATABASE_URL is available
function getAdapter(): any {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }
  
  try {
    const { PrismaAdapter } = require("@next-auth/prisma-adapter");
    const { PrismaClient } = require("@prisma/client");
    
    const globalForPrismaAuth = globalThis as unknown as {
      prismaAuth: any;
    };
    
    if (!globalForPrismaAuth.prismaAuth) {
      globalForPrismaAuth.prismaAuth = new PrismaClient();
    }
    
    return PrismaAdapter(globalForPrismaAuth.prismaAuth);
  } catch {
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
    strategy: "jwt",
  },
};
