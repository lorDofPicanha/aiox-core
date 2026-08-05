import { NextResponse, type NextRequest } from "next/server";
import { hasValidBasicAuth } from "@/lib/http/basic-auth";

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  return response;
}

export function proxy(request: NextRequest) {
  const valid = hasValidBasicAuth(
    request.headers.get("authorization"),
    process.env.NOYCE_ACCESS_USER,
    process.env.NOYCE_ACCESS_PASSWORD,
  );

  if (!valid) {
    return applySecurityHeaders(
      new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Noyce Private Pilot", charset="UTF-8"' },
      }),
    );
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = { matcher: "/:path*" };
