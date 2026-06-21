import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (NO db / bcrypt) — shared by middleware and the full
// node-side auth. Only JWT decode + role plumbing happen here.
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "admin";
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
