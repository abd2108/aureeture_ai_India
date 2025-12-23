import { NextResponse } from "next/server";

/**
 * Temporarily bypass Clerk middleware in Next 15 to avoid
 * `headers()` sync-usage errors. Auth is still handled on the
 * backend and via Clerk client-side components.
 */
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
