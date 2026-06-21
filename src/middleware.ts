import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge middleware uses the db-free config — it only decodes the JWT to gate
// /admin routes. Real authorization is re-checked in every server action.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  if (pathname.startsWith("/admin") && !isLogin && !req.auth) {
    const url = new URL("/admin/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }
  // Already signed in but visiting the login page → send to dashboard.
  if (isLogin && req.auth) {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = { matcher: ["/admin/:path*"] };
