import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

// 1) Global Clerk middleware (adds auth context)
export const clerkAuthMiddleware = clerkMiddleware();

// 2) Protect routes (ensure user is signed in)
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({
      success: false,
      error: { message: "Unauthorized" },
    });
  }

  (req as any).auth = auth; // so your controllers can access req.auth.userId
  next();
};
