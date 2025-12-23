import { Router } from "express";
import Mentorship from "../models/mentorship.model";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import Student from "../models/student.model";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/requireRole.middleware";

const router = Router();

// GET student profile (role: student)
// Relaxed requireRole here so the layout can check for profile existence without getting a 403
router.get("/student/profile", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).auth?.userId;
    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const student = await Student.findOne({ userId: user._id }).lean();
    return res.json({ success: true, data: student || null });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return res.status(500).json({ message: "An error occurred on the server." });
  }
});

// Upsert student profile into Student collection
router.post("/student/profile", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).auth?.userId;
    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const payload = req.body || {};

    const student = await Student.findOneAndUpdate(
      { userId: user._id },
      {
        $setOnInsert: { userId: user._id, role: "student" },
        $set: {
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          linkedinUrl: payload.linkedinUrl,
          resumeFile: payload.resumeFile,
          educations: payload.educations ?? [],
          experiences: payload.experiences ?? [],
          projects: payload.projects ?? [],
          awards: payload.awards,
          links: payload.links ?? {},
          skills: payload.skills ?? [],
          location: payload.location,
          availability: payload.availability,
          preferences: payload.preferences,
        },
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: student });
  } catch (error) {
    console.error("Error saving student profile:", error);
    return res.status(500).json({ message: "An error occurred on the server." });
  }
});

// GET /api/student/my-mentors?studentId=...
router.get("/student/my-mentors", requireRole("student"), async (req, res) => {
  try {
    const { studentId } = req.query as { studentId?: string };
    if (!studentId) return res.status(400).json({ message: "studentId is required" });

    const mentorships = await Mentorship.find({
      menteeClerkId: studentId,
      status: { $ne: "ended" },
    })
      .sort({ updatedAt: -1 })
      .lean();

    const mentorIds = Array.from(new Set(mentorships.map((m: any) => m.mentorId).filter(Boolean)));

    if (mentorIds.length === 0) return res.json({ mentors: [], total: 0 });

    const users = await User.find({ clerkId: { $in: mentorIds } }).lean();
    const userByClerk = new Map(users.map((u: any) => [u.clerkId, u]));

    const userObjectIds = users.map((u: any) => u._id);

    const profiles = await Profile.find({
      userId: { $in: userObjectIds },
      onboardingComplete: true,
    })
      .populate("userId", "name email avatar clerkId")
      .lean();

    const profileByClerk = new Map<string, any>();
    for (const p of profiles as any[]) {
      const clerkId = (p.userId as any)?.clerkId;
      if (clerkId) profileByClerk.set(clerkId, p);
    }

    const mentors = mentorIds.map((clerkId) => {
      const u = userByClerk.get(clerkId);
      const p = profileByClerk.get(clerkId);

      const name = (u?.name || (p?.userId as any)?.name || "Mentor") as string;

      return {
        id: clerkId,
        name,
        role: p?.currentRole || "Professional",
        company: p?.currentCompany || "Company",
        expertise: (p?.skills || []).slice(0, 3).length ? (p?.skills || []).slice(0, 3) : ["Mentorship"],
        rating: 4.8,
        reviews: 0,
        price: 0,
        availability: "—",
        verified: true,
        linkedinUrl:
          p?.personalInfo?.linkedIn ||
          `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`,
      };
    });

    return res.json({ mentors, total: mentors.length });
  } catch (error) {
    console.error("Error fetching student mentors:", error);
    return res.status(500).json({ message: "An error occurred on the server." });
  }
});

export default router;
