import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { CLERK_ENABLED, NODE_ENV } from "../config";

let clerkWarned = false;
const noopAuthMiddleware: RequestHandler = (_req, _res, next) => {
  if (!clerkWarned) {
    console.warn(
      "[auth] Clerk middleware is disabled because CLERK_SECRET_KEY or CLERK_PUBLISHABLE_KEY is missing.",
    );
    clerkWarned = true;
  }
  next();
};

const devAuthMiddleware: RequestHandler = (req, _res, next) => {
  // Allow overriding via headers for easier testing
  const mockUserId =
    (req.headers["x-mock-user-id"] as string | undefined) || "dev-user";
  const mockSessionId =
    (req.headers["x-mock-session-id"] as string | undefined) || "dev-session";

  (req as any).auth = {
    userId: mockUserId,
    sessionId: mockSessionId,
  };
  next();
};

// 1) Global Clerk middleware (adds auth context)
export const clerkAuthMiddleware = CLERK_ENABLED
  ? clerkMiddleware()
  : NODE_ENV === "production"
    ? noopAuthMiddleware
    : devAuthMiddleware;

// 2) Protect routes (ensure user is signed in)
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!CLERK_ENABLED && NODE_ENV === "production") {
    return res.status(503).json({
      success: false,
      error: {
        message:
          "Authentication is not configured. Set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY to enable protected routes.",
      },
    });
  }

  const auth = CLERK_ENABLED ? getAuth(req) : (req as any).auth;

  if (!auth.userId) {
    return res.status(401).json({
      success: false,
      error: { message: "Unauthorized" },
    });
  }

  // so your controllers can access req.auth.userId
  (req as any).auth = auth;
  // also expose roleContext if the resolver ran earlier in the chain
  if ((req as any).roleContext) {
    (req as any).auth.roleContext = (req as any).roleContext;
  }
  next();
};
