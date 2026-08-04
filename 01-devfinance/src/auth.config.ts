import type { NextAuthConfig } from "next-auth";

/**
 * Configuração base do NextAuth que NÃO depende de Prisma/bcrypt.
 * Usada pelo middleware (Edge runtime) que não suporta essas dependências.
 * O auth.ts principal estende esta config adicionando o Credentials provider.
 */
export const authConfig = {
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Providers adicionados no auth.ts principal
} satisfies NextAuthConfig;
