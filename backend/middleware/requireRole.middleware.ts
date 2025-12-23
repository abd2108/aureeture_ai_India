import { NextFunction, Request, Response } from "express";

type Role = "mentor" | "student" | "founder";

const headerKey = "x-active-role";

const normalize = (val?: string | string[]) =>
  (Array.isArray(val) ? val[0] : val || "").toLowerCase();

/**
 * Enforces that the authenticated request is for the expected role.
 * Looks at:
 *  - req.roleContext.<role> presence (populated by roleResolverMiddleware)
 *  - optional header `x-active-role` to catch cross-tab mismatches
 */
export const requireRole =
  (role: Role) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const ctx = (req as any).roleContext || {};
      const activeHeader = normalize(req.headers[headerKey]);
      const hasDoc =
        (role === "mentor" && !!ctx.mentor) ||
        (role === "student" && !!ctx.student) ||
        (role === "founder" && !!ctx.founder);

      if (!hasDoc) {
        return res
          .status(403)
          .json({ success: false, message: `Access denied: ${role} role not provisioned` });
      }

      if (activeHeader && activeHeader !== role) {
        return res.status(403).json({
          success: false,
          message: `Active role mismatch. Expected ${role}, got ${activeHeader}`,
        });
      }

      next();
    } catch (err) {
      return res.status(403).json({ success: false, message: "Role validation failed" });
    }
  };


