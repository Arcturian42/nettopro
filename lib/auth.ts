import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  debug: true, // Active le debug
  logger: {
    error: (code, metadata) => {
      console.error("[NextAuth Error]", code, metadata);
    },
    warn: (code) => {
      console.warn("[NextAuth Warn]", code);
    },
    debug: (code, metadata) => {
      console.log("[NextAuth Debug]", code, metadata);
    },
  },
};
