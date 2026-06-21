import "server-only";
import { auth } from "./auth";

/** Re-checks the session on the server for every admin mutation. Throws if not an admin. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}
