import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

let clerkFetchWarned = false;

export const syncUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return next();

    let email = "";
    let name = "User";
    try {
      const cu = await clerkClient.users.getUser(auth.userId);
      const emailRaw = cu.emailAddresses?.[0]?.emailAddress || "";
      email = emailRaw.toLowerCase().trim();
      name =
        [cu.firstName, cu.lastName].filter(Boolean).join(" ") ||
        cu.username ||
        email ||
        "User";
    } catch (err) {
      if (!clerkFetchWarned) {
        // eslint-disable-next-line no-console
        console.warn("[auth] Clerk fetch failed; proceeding with auth.userId only.");
        clerkFetchWarned = true;
      }
      // proceed with minimal data
      email = "";
      name = "User";
    }

    // Find existing by clerkId OR email first, then update to avoid duplicate key errors
    let user = await User.findOne({
      $or: [{ clerkId: auth.userId }, ...(email ? [{ email }] : [])],
    });

    if (user) {
      user.clerkId = auth.userId;
      if (email) user.email = email;
      if (name) user.name = name;
      await user.save();
    } else {
      try {
        user = await User.create({
          clerkId: auth.userId,
          email: email || `${auth.userId}@local`,
          name,
        });
      } catch (createErr: any) {
        // If duplicate error, re-fetch and update
        const dup = await User.findOne({
          $or: [{ clerkId: auth.userId }, ...(email ? [{ email }] : [])],
        });
        if (dup) {
          dup.clerkId = auth.userId;
          if (email) dup.email = email;
          if (name) dup.name = name;
          await dup.save();
          user = dup;
        } else {
          throw createErr;
        }
      }
    }

    (req as any).dbUser = user;
    next();
  } catch (err: any) {
    console.error("syncUserMiddleware error:", err);
    next(err);
  }
};
