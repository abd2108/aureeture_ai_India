import { Router } from 'express';
import mongoose from 'mongoose';
import Mentorship from '../models/mentorship.model';
import MentorSession from '../models/mentorSession.model';
import User from '../models/user.model';
import Profile from '../models/profile.model';

const router = Router();

/**
 * Ensure mentorship rows exist for this student based on existing MentorSession docs.
 * This solves the "mentors: []" issue when Mentorship mapping hasn't been created yet.
 */
const ensureMentorshipsForStudentFromSessions = async (studentId: string) => {
  // Sessions booked by this student (clerk user id)
  const sessions = await MentorSession.find({ studentId })
    .select('mentorId studentId studentEmail studentName title')
    .lean();

  for (const s of sessions) {
    const mentorId = String((s as any).mentorId || '').trim();
    if (!mentorId) continue;

    const menteeClerkId = String((s as any).studentId || '').trim();
    const menteeEmail = String((s as any).studentEmail || '').toLowerCase().trim();

    const query: any = { mentorId, menteeClerkId };
    // fallback if no clerkId (rare)
    if (!menteeClerkId && menteeEmail) {
      delete query.menteeClerkId;
      query.menteeEmail = menteeEmail;
    }

    const update: any = {
      $setOnInsert: {
        mentorId,
        menteeClerkId: menteeClerkId || undefined,
        menteeEmail: menteeEmail || undefined,
        status: 'active',
        menteeName: (s as any).studentName || 'Mentee',
        goal: (s as any).title || 'Career development',
      },
      $set: {
        ...(s.studentName ? { menteeName: s.studentName } : {}),
        ...(s.title ? { goal: s.title } : {}),
        updatedAt: new Date(),
      },
    };

    await Mentorship.findOneAndUpdate(query, update, { upsert: true, new: true }).catch(() => null);
  }
};

/**
 * GET /api/student/my-mentors
 *
 * Query params:
 * - studentId (required): Clerk userId of the student
 *
 * Response:
 * { mentors: Array<{ id, name, role, company, expertise, rating, reviews, price, availability, verified, linkedinUrl }>, total }
 */
router.get('/student/my-mentors', async (req, res) => {
  try {
    const { studentId } = req.query as { studentId?: string };
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    // ✅ 1) Try mentorship mapping
    let mentorships = await Mentorship.find({
      menteeClerkId: studentId,
      status: { $ne: 'ended' },
    })
      .sort({ updatedAt: -1 })
      .lean();

    // ✅ 2) Backward compatible: if empty, derive from sessions and create mentorship rows
    if (!mentorships.length) {
      await ensureMentorshipsForStudentFromSessions(studentId);
      mentorships = await Mentorship.find({
        menteeClerkId: studentId,
        status: { $ne: 'ended' },
      })
        .sort({ updatedAt: -1 })
        .lean();
    }

    const mentorIds = Array.from(
      new Set(mentorships.map((m: any) => String(m.mentorId)).filter(Boolean))
    );

    if (mentorIds.length === 0) return res.json({ mentors: [], total: 0 });

    // ✅ Load mentor users by clerkId
    const users = await User.find({ clerkId: { $in: mentorIds } }).lean();
    const userByClerk = new Map<string, any>(users.map((u: any) => [u.clerkId, u]));

    // ✅ IMPORTANT: Profile.userId is ObjectId, keep objectIds not strings
    const userObjectIds = users.map((u: any) => u._id);

    const profiles = await Profile.find({
      userId: { $in: userObjectIds },
      onboardingComplete: true,
    })
      .populate('userId', 'name email avatar clerkId')
      .lean();

    const profileByClerk = new Map<string, any>();
    for (const p of profiles as any[]) {
      const clerkId = (p.userId as any)?.clerkId;
      if (clerkId) profileByClerk.set(clerkId, p);
    }

    // Optional: compute price / availability from mentor sessions
    const allMentorSessions = await MentorSession.find({
      mentorId: { $in: mentorIds },
    })
      .select('mentorId amount startTime status')
      .lean();

    const mentors = mentorIds.map((clerkId) => {
      const u = userByClerk.get(clerkId);
      const p = profileByClerk.get(clerkId);

      const name = (u?.name || (p?.userId as any)?.name || 'Mentor') as string;
      const role = (p?.currentRole || 'Professional') as string;
      const company = (p?.currentCompany || 'Company') as string;

      const skills: string[] = Array.isArray(p?.skills) ? p.skills.slice(0, 3) : [];
      const linkedinUrl =
        p?.personalInfo?.linkedIn ||
        `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`;

      // price: avg of paid amounts
      const ms = allMentorSessions.filter((s: any) => String(s.mentorId) === String(clerkId));
      const paid = ms.filter((s: any) => (s.amount || 0) > 0);
      const price =
        paid.length > 0
          ? Math.round(paid.reduce((sum: number, s: any) => sum + (s.amount || 0), 0) / paid.length)
          : 0;

      // availability: next scheduled session date text
      const upcoming = ms
        .filter((s: any) => s.status === 'scheduled' && new Date(s.startTime) > new Date())
        .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      const availability =
        upcoming.length > 0
          ? new Date(upcoming[0].startTime).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })
          : 'Available Now';

      return {
        id: clerkId,
        name,
        role,
        company,
        expertise: skills.length ? skills : ['Mentorship'],
        rating: 4.8,
        reviews: 0,
        price,
        availability,
        verified: true,
        linkedinUrl,
      };
    });

    return res.json({ mentors, total: mentors.length });
  } catch (error) {
    console.error('Error fetching student mentors:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

export default router;
