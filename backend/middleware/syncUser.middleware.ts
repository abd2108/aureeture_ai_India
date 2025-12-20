import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const syncUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return next();

    // Get Clerk user (only if we might need to insert missing fields)
    const cu = await clerkClient.users.getUser(auth.userId);

    const email = cu.emailAddresses?.[0]?.emailAddress || "";
    const name =
      [cu.firstName, cu.lastName].filter(Boolean).join(" ") ||
      cu.username ||
      email ||
      "User";

    // ✅ Atomic upsert (prevents duplicate key race)
    const user = await User.findOneAndUpdate(
  { clerkId: auth.userId },
  {
    $setOnInsert: {
      clerkId: auth.userId,
      role: "unassigned",     // ✅ better default
      createdAt: new Date(),
    },
    $set: {
      email,
      name,
      updatedAt: new Date(),
    },
  },
  { new: true, upsert: true }
);


    (req as any).dbUser = user;
    next();
  } catch (err: any) {
    console.error("syncUserMiddleware error:", err);
    next(err);
  }
};
