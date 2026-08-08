import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { rateLimit, checkRateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/validations/auth";

function getClientIp(req: unknown): string {
  const headers = (req as { headers?: Record<string, string> })?.headers ?? {};
  return (
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["x-real-ip"]?.trim() ||
    "unknown"
  );
}

function recordFailedAttempt(key: string, ip: string) {
  rateLimit(key, { limit: 5, windowMs: 15 * 60 * 1000, blockMs: 15 * 60 * 1000 });
  rateLimit(`login-ip:${ip}`, {
    limit: 20,
    windowMs: 15 * 60 * 1000,
    blockMs: 15 * 60 * 1000,
  });
}

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // =========================
    // EMAIL + PASSWORD
    // =========================
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = normalizeEmail(credentials.email);
        const ip = getClientIp(req);
        const key = `login:${email}:${ip}`;

        const blocked =
          checkRateLimit(key, {
            limit: 5,
            windowMs: 15 * 60 * 1000,
            blockMs: 15 * 60 * 1000,
          }).blocked ||
          checkRateLimit(`login-ip:${ip}`, {
            limit: 20,
            windowMs: 15 * 60 * 1000,
            blockMs: 15 * 60 * 1000,
          }).blocked;
        if (blocked) {
          throw new Error("Too many attempts. Please try again in 15 minutes.");
        }

        const user = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: "insensitive" },
          },
        });

        if (!user || !user.password) {
          recordFailedAttempt(key, ip);
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          recordFailedAttempt(key, ip);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    // =========================
    // GOOGLE
    // =========================
    // Only register the provider when OAuth credentials are configured;
    // otherwise the sign-in button would point at a broken provider.
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true, // Enables account linking
          }),
        ]
      : []),
  ],

  // =========================
  // SESSION
  // =========================
  session: {
    strategy: "jwt",
  },

  // =========================
  // CALLBACKS (Required for JWT + PrismaAdapter)
  // =========================
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // =========================
  // PAGES
  // =========================
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);