import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

// Check if we have a database connection
const hasDatabase = !!process.env.DATABASE_URL;

export const authOptions: NextAuthOptions = {
  // Only use PrismaAdapter if database is available
  ...(hasDatabase && { adapter: PrismaAdapter(prisma) }),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        // With JWT strategy, use token; with DB strategy, use user
        if (token) {
          (session.user as any).id = token.sub;
          (session.user as any).role = (token as any).role;
        } else if (user) {
          (session.user as any).id = user.id;
          (session.user as any).role = (user as any).role;
        }
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
  },
  
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  
  session: {
    // Use JWT if no database, otherwise use database sessions
    strategy: hasDatabase ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Only enable debug in development
  debug: process.env.NODE_ENV === "development",
};
