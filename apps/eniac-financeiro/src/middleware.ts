/**
 * Auth gate. Renova a sessão Supabase a cada request e redireciona usuários
 * não autenticados para /login. Roda no Edge runtime — constrói o client com
 * os objetos de cookie da request/response (não usa next/headers).
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PUBLIC_PATHS = new Set([
  "/login",
  "/login/check-email",
  "/api/health",
  // PWA: o navegador busca estes sem sessão. Um redirect para /login aqui
  // faria o registro do service worker falhar e o manifest ser ignorado.
  "/manifest.webmanifest",
  "/sw.js",
  "/offline.html",
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/auth/")) return true; // magic-link / OAuth callback
  if (pathname.startsWith("/api/auth/")) return true; // logout (POST, CSRF-safe)
  return false;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return res;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value } of cookiesToSet) {
          req.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Já logado tentando ver /login → manda pra home
  if (user && pathname === "/login") {
    const home = req.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
