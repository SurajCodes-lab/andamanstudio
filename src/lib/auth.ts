import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";
import { db } from "./db/client";
import { users } from "./db/schema";

const creds = z.object({ email: z.string().email(), password: z.string().min(1) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = creds.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user.id), email: user.email, name: user.name ?? undefined, role: user.role };
      },
    }),
  ],
});
