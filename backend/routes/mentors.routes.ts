// backend/src/routes/mentors.routes.ts
import { Router } from "express";
import MentorSession from "../models/mentorSession.model";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import MentorAvailability from "../models/mentorAvailability.model";

const router = Router();

/**
 * Demo seed:
 * - NOTE: This only runs when there are *zero* mentor sessions in DB.
 * - It does NOT overwrite real mentors; it just creates demo users/profiles.
 */
const ensureDemoMentors = async () => {
  const existingSessions = await MentorSession.countDocuments();
  if (existingSessions > 0) return;

  const demoMentors = [
    {
      clerkId: "mentor_aditi_sharma",
      email: "aditi.sharma@example.com",
      name: "Aditi Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AditiSharma",
    },
    {
      clerkId: "mentor_rohan_mehta",
      email: "rohan.mehta@example.com",
      name: "Rohan Mehta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanMehta",
    },
    {
      clerkId: "mentor_sameer_khan",
      email: "sameer.khan@example.com",
      name: "Sameer Khan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SameerKhan",
    },
    {
      clerkId: "mentor_priya_singh",
      email: "priya.singh@example.com",
      name: "Priya Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSingh",
    },
    {
      clerkId: "mentor_vikram_kumar",
      email: "vikram.kumar@example.com",
      name: "Vikram Kumar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VikramKumar",
    },
    {
      clerkId: "mentor_ananya_gupta",
      email: "ananya.gupta@example.com",
      name: "Ananya Gupta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaGupta",
    },
  ];

  for (const mentorData of demoMentors) {
    let user = await User.findOne({ clerkId: mentorData.clerkId });
    if (!user) user = await User.create(mentorData);

    const profileData = {
      userId: user._id,
      careerStage: "Professional",
      currentRole:
        mentorData.name.includes("Aditi") ? "Director of Engineering" :
        mentorData.name.includes("Rohan") ? "Principal PM" :
        mentorData.name.includes("Sameer") ? "Lead Data Scientist" :
        mentorData.name.includes("Priya") ? "Senior UX Designer" :
        mentorData.name.includes("Vikram") ? "Staff Engineer" :
        "Marketing Head",
      currentCompany:
        mentorData.name.includes("Aditi") ? "Google" :
        mentorData.name.includes("Rohan") ? "Microsoft" :
        mentorData.name.includes("Sameer") ? "Amazon" :
        mentorData.name.includes("Priya") ? "Cred" :
        mentorData.name.includes("Vikram") ? "Zerodha" :
        "Zomato",
      joinDate: "Jul 2025",
      personalInfo: {
        linkedIn: `https://www.linkedin.com/in/${mentorData.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
      skills:
        mentorData.name.includes("Aditi") ? ["System Design", "Scalability"] :
        mentorData.name.includes("Rohan") ? ["Product Strategy", "B2B SaaS"] :
        mentorData.name.includes("Sameer") ? ["AI/ML", "Python"] :
        mentorData.name.includes("Priya") ? ["Design Systems", "Figma"] :
        mentorData.name.includes("Vikram") ? ["Backend", "Golang"] :
        ["Growth", "Brand"],
      onboardingComplete: true,
    };

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) await Profile.create(profileData);
  }
};

const computeExperienceYearsFallback = (role: string) => {
  const r = (role || "").toLowerCase();
  if (r.includes("director")) return 12;
  if (r.includes("principal")) return 9;
  if (r.includes("lead")) return 8;
  if (r.includes("senior")) return 7;
  if (r.includes("staff")) return 10;
  return 6;
};

const inferDomain = (role: string, skills: string[]) => {
  const r = (role || "").toLowerCase();
  const s = (skills || []).map((x) => String(x).toLowerCase());

  const has = (kw: string) => r.includes(kw) || s.some((x) => x.includes(kw));

  if (has("design") || has("figma") || has("ux") || has("ui")) return "Design";
  if (has("data") || has("scientist") || has("ml") || has("ai") || has("python")) return "Data Science";
  if (has("product") || has("pm") || has("saas")) return "Product";
  if (has("marketing") || has("growth") || has("brand")) return "Marketing";
  return "Software";
};

const computeAvailabilityText = (nextSessionStart?: Date) => {
  if (!nextSessionStart) return "Available Now";

  const now = new Date();
  const daysDiff = Math.ceil((nextSessionStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 0) return "Available Now";
  if (daysDiff === 1) return "Tomorrow";
  return nextSessionStart.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// GET /api/mentors
router.get("/mentors", async (req, res) => {
  try {
    // Optional: only for demo; does not override real mentors
    await ensureDemoMentors();

    /**
     * ✅ UNION LOGIC
     * Source A: mentor-like profiles (real mentors who completed onboarding)
     * Source B: mentorIds present in sessions (mentors who have sessions)
     */
    const mentorProfiles = await Profile.find({
      onboardingComplete: true,
      currentRole: { $exists: true, $ne: null },
      currentCompany: { $exists: true, $ne: null },
    })
      .populate("userId", "name email avatar clerkId")
      .limit(200)
      .lean();

    const profileClerkIds = mentorProfiles
      .map((p: any) => (p.userId as any)?.clerkId)
      .filter((id: any): id is string => !!id);

    const sessionMentorClerkIds = await MentorSession.distinct("mentorId");
    const mentorClerkIds = Array.from(new Set([...profileClerkIds, ...sessionMentorClerkIds])).filter(Boolean);

    if (mentorClerkIds.length === 0) {
      return res.json({
        mentors: [],
        stats: { totalMentors: 0, avgHourlyRate: 0, activeSessions: 0, satisfaction: "0.0" },
      });
    }

    // Users by clerkId
    const users = await User.find({ clerkId: { $in: mentorClerkIds } }).lean();
    const userByClerk = new Map<string, any>(users.map((u: any) => [u.clerkId, u]));

    // Profiles by clerkId (start with mentorProfiles, then pull missing)
    const profileByClerk = new Map<string, any>();
    mentorProfiles.forEach((p: any) => {
      const cid = (p.userId as any)?.clerkId;
      if (cid) profileByClerk.set(cid, p);
    });

    // Fetch missing profiles for mentors that exist only in sessions
    const missingClerks = mentorClerkIds.filter((cid) => !profileByClerk.has(cid));
    if (missingClerks.length > 0) {
      const missingUsers = await User.find({ clerkId: { $in: missingClerks } }).lean();
      missingUsers.forEach((u: any) => userByClerk.set(u.clerkId, u));

      const missingUserIds = missingUsers.map((u: any) => u._id);
      const missingProfiles = await Profile.find({
        userId: { $in: missingUserIds },
        onboardingComplete: true,
      })
        .populate("userId", "name email avatar clerkId")
        .lean();

      missingProfiles.forEach((p: any) => {
        const cid = (p.userId as any)?.clerkId;
        if (cid) profileByClerk.set(cid, p);
      });
    }

    // Sessions for stats calculations
    const allSessions = await MentorSession.find({ mentorId: { $in: mentorClerkIds } }).lean();

    const mentors = await Promise.all(
      mentorClerkIds.map(async (clerkId) => {
        const u = userByClerk.get(clerkId);
        const p = profileByClerk.get(clerkId);

        const name = (u?.name || (p?.userId as any)?.name || "Mentor") as string;
        const role = (p?.currentRole || "Professional") as string;
        const company = (p?.currentCompany || "Company") as string;

        const skills: string[] = Array.isArray(p?.skills) ? p.skills : [];
        const expertise = skills.slice(0, 3);
        const domain = inferDomain(role, skills);

        // Experience: workHistory -> else fallback
        let experienceYears = 0;
        const workHistory = p?.workHistory || [];
        if (Array.isArray(workHistory) && workHistory.length > 0) {
          const withFrom = workHistory.filter((w: any) => w?.from);
          if (withFrom.length > 0) {
            const earliest = withFrom.reduce((a: any, b: any) =>
              new Date(a.from) < new Date(b.from) ? a : b
            );
            const years = (Date.now() - new Date(earliest.from).getTime()) / (1000 * 60 * 60 * 24 * 365);
            experienceYears = Math.max(0, Math.round(years));
          }
        }
        if (!experienceYears) experienceYears = computeExperienceYearsFallback(role);

        // Sessions for this mentor
        const mentorSessions = allSessions.filter((s: any) => s.mentorId === clerkId);
        const completedSessions = mentorSessions.filter((s: any) => s.status === "completed");
        const reviews = completedSessions.length;
        const rating = reviews > 0 ? 4.9 : 4.7; // mock until review system exists

        // Price
        const priced = mentorSessions.filter((s: any) => typeof s.amount === "number" && s.amount > 0);
        const avgPrice =
          priced.length > 0
            ? Math.round(priced.reduce((sum: number, s: any) => sum + (s.amount || 0), 0) / priced.length)
            : role.toLowerCase().includes("director")
            ? 5000
            : role.toLowerCase().includes("principal")
            ? 4200
            : role.toLowerCase().includes("lead")
            ? 3500
            : role.toLowerCase().includes("senior")
            ? 2800
            : role.toLowerCase().includes("staff")
            ? 3000
            : 2500;

        // Availability from next upcoming session (simple)
        const upcoming = mentorSessions
          .filter((s: any) => s.status === "scheduled" && new Date(s.startTime) > new Date())
          .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        const nextSessionStart = upcoming.length ? new Date(upcoming[0].startTime) : undefined;
        const availabilityText = computeAvailabilityText(nextSessionStart);

        // Optional doc exists (not mandatory for showing availability)
        await MentorAvailability.findOne({ mentorId: clerkId }).lean().catch(() => null);

        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        const linkedinUrl =
          p?.personalInfo?.linkedIn ||
          `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`;

        return {
          id: clerkId,
          name,
          role,
          company,
          companyLogo: "",
          avatarInitial: initials,
          rating,
          reviews,
          expertise: expertise.length ? expertise : ["Mentorship"],
          price: avgPrice,
          availability: availabilityText,
          domain,
          experience: `${experienceYears} Yrs`,
          verified: true,
          linkedinUrl,
        };
      })
    );

    // Stats
    const totalMentors = mentors.length;
    const avgHourlyRate =
      mentors.length > 0
        ? Math.round(mentors.reduce((sum, m) => sum + (m.price || 0), 0) / mentors.length)
        : 0;

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const activeSessions = allSessions.filter(
      (s: any) =>
        s.status === "scheduled" &&
        new Date(s.startTime) >= new Date() &&
        new Date(s.startTime) <= sevenDaysFromNow
    ).length;

    const avgSatisfaction =
      mentors.length > 0
        ? (mentors.reduce((sum, m) => sum + (m.rating || 0), 0) / mentors.length).toFixed(1)
        : "0.0";

    return res.json({
      mentors,
      stats: {
        totalMentors,
        avgHourlyRate,
        activeSessions,
        satisfaction: avgSatisfaction,
      },
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({ message: "An error occurred on the server." });
  }
});

export default router;