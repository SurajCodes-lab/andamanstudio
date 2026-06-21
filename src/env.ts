import { z } from "zod";

// Server-side environment validation. NEVER import from a client component.
const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth (NextAuth v5)
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),

  // Uploads — stored on the server's local disk (Lightsail). Public URL prefix
  // and on-disk folder (relative to project root). Defaults to public/uploads.
  UPLOAD_DIR: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

// Where uploaded images live on disk, and the public URL prefix they're served at.
export const UPLOAD_DIR = env.UPLOAD_DIR || "public/uploads";
export const UPLOAD_URL_PREFIX = "/uploads";
