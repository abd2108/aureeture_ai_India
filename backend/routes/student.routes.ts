import { Router } from "express";
import Mentorship from "../models/mentorship.model";
import User from "../models/user.model";
import Profile from "../models/profile.model";

const router = Router();

// GET /api/student/my-mentors?studentId=...
router.get("/student/my-mentors", async (req, res) => {
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
