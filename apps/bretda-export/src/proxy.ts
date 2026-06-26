import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renamed the "middleware" convention to "proxy" (same signature).
export default createMiddleware(routing);

export const config = {
  // Match all paths except api, next internals, and files with extensions
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
