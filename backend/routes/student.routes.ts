import { Router } from 'express';
import Mentorship from '../models/mentorship.model';
import User from '../models/user.model';
import Profile from '../models/profile.model';

const router = Router();

/**
 * GET /api/student/my-mentors
 *
 * Returns mentors that are mapped to a registered student (mentee) via the Mentorship
 * collection.
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

    const mentorships = await Mentorship.find({ menteeClerkId: studentId, status: { $ne: 'ended' } })
      .sort({ updatedAt: -1 })
      .lean();

    const mentorIds = Array.from(new Set(mentorships.map((m: any) => m.mentorId).filter(Boolean)));
    if (mentorIds.length === 0) return res.json({ mentors: [], total: 0 });

    const users = await User.find({ clerkId: { $in: mentorIds } }).lean();
    const userByClerk = new Map<string, any>(users.map((u: any) => [u.clerkId, u]));

    const userObjectIds = users.map((u: any) => u._id);
    const profiles = await Profile.find({ userId: { $in: userObjectIds }, onboardingComplete: true })
      .populate('userId', 'name email avatar clerkId')
      .lean();
    const profileByClerk = new Map<string, any>(
      profiles
        .map((p: any) => {
          const clerkId = (p.userId as any)?.clerkId;
          return clerkId ? [clerkId, p] : null;
        })
        .filter(Boolean) as any
    );

    const mentors = mentorIds.map((clerkId) => {
      const u = userByClerk.get(clerkId);
      const p = profileByClerk.get(clerkId);

      const name = (u?.name || (p?.userId as any)?.name || 'Mentor') as string;
      const role = (p?.currentRole || 'Professional') as string;
      const company = (p?.currentCompany || 'Company') as string;
      const skills: string[] = (p?.skills || []).slice(0, 3);
      const linkedinUrl = p?.personalInfo?.linkedIn || `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`;

      return {
        id: clerkId,
        name,
        role,
        company,
        expertise: skills.length ? skills : ['Mentorship'],
        rating: 4.8,
        reviews: 0,
        price: 0,
        availability: '—',
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
