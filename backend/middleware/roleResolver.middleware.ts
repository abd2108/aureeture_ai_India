import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";
import Student from "../models/student.model";
import Mentor from "../models/mentor.model";
import Founder from "../models/founder.model";
import { CLERK_ENABLED } from "../config";

/**
 * Resolves the authenticated user's role documents (student/mentor/founder)
 * and attaches them to req.roleContext. Non-blocking: proceeds even if
 * no role doc exists yet.
 */
export const roleResolverMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const auth = CLERK_ENABLED ? getAuth(req) : (req as any).auth;
    if (!auth.userId) return next();

    const user = await User.findOne({ clerkId: auth.userId }).lean();
    if (!user) return next();

    const [student, mentor, founder] = await Promise.all([
      Student.findOne({ userId: user._id }).lean().catch(() => null),
      Mentor.findOne({ userId: user._id }).lean().catch(() => null),
      Founder.findOne({ userId: user._id }).lean().catch(() => null),
    ]);

    (req as any).roleContext = {
      user,
      student,
      mentor,
      founder,
      role:
        (mentor && "mentor") ||
        (student && "student") ||
        (founder && "founder") ||
        undefined,
    };

    return next();
  } catch (err) {
    // Fail open to avoid blocking requests
    return next();
  }
};

