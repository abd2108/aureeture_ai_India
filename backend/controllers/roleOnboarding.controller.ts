import { Request, Response, NextFunction } from "express";
import Mentor from "../models/mentor.model";
import Student from "../models/student.model";
import Founder from "../models/founder.model";
import User from "../models/user.model";

const findUserByClerk = async (clerkId: string) => {
  return User.findOne({ clerkId });
};

export const upsertMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = (req as any).auth?.userId;
    if (!clerkId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

    const user = await findUserByClerk(clerkId);
    if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });

    const payload = req.body || {};
    const mentor = await Mentor.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          name: payload.name,
          currentRole: payload.currentRole,
          company: payload.company,
          linkedinUrl: payload.linkedinUrl,
          resumeUrl: payload.resumeUrl,
          totalExperienceYears: payload.totalExperienceYears ?? null,
          educationDegree: payload.educationDegree,
          educationCollege: payload.educationCollege,
          specializationTags: payload.specializationTags ?? [],
          pricing: {
            expectedHourlyRate: payload.pricing?.expectedHourlyRate ?? null,
            expectedHalfHourRate: payload.pricing?.expectedHalfHourRate ?? null,
            currency: payload.pricing?.currency ?? "INR",
          },
          timezone: payload.timezone ?? "Asia/Kolkata",
          weeklyAvailability: payload.weeklyAvailability ?? [],
          overrideAvailability: payload.overrideAvailability ?? [],
          isVerified: payload.isVerified ?? false,
          isOnline: payload.isOnline ?? true,
        },
        $setOnInsert: { role: "mentor", userId: user._id },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: mentor });
  } catch (err) {
    next(err);
  }
};

export const upsertStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = (req as any).auth?.userId;
    if (!clerkId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

    const user = await findUserByClerk(clerkId);
    if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });

    const p = req.body || {};
    const student = await Student.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          fullName: p.fullName,
          email: p.email,
          phone: p.phone,
          linkedinUrl: p.linkedinUrl,
          resumeFile: p.resumeFile,
          educations: p.educations ?? [],
          experiences: p.experiences ?? [],
          projects: p.projects ?? [],
          awards: p.awards,
          links: {
            portfolio: p.links?.portfolio,
            github: p.links?.github,
            leetcode: p.links?.leetcode,
            codechef: p.links?.codechef,
            other: p.links?.other,
          },
          skills: p.skills ?? [],
          location: p.location,
          availability: p.availability,
          preferences: p.preferences,
        },
        $setOnInsert: { role: "student", userId: user._id },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

export const upsertFounder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = (req as any).auth?.userId;
    if (!clerkId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

    const user = await findUserByClerk(clerkId);
    if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });

    const p = req.body || {};
    const founder = await Founder.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          name: p.name,
          email: p.email,
          linkedinUrl: p.linkedinUrl,
          companyName: p.companyName,
          headline: p.headline,
          ideaDescription: p.ideaDescription,
          stage: p.stage,
          needs: p.needs ?? [],
          website: p.website,
          location: p.location,
        },
        $setOnInsert: { role: "founder", userId: user._id },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: founder });
  } catch (err) {
    next(err);
  }
};

