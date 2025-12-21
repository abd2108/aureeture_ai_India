import { Router } from 'express';
import MentorSession from '../models/mentorSession.model';
import User from '../models/user.model';
import Profile from '../models/profile.model';
import MentorAvailability from '../models/mentorAvailability.model';

const router = Router();

// Helper to ensure demo mentors exist
const ensureDemoMentors = async () => {
  // Check if we already have mentor sessions (indicating mentors exist)
  const existingSessions = await MentorSession.countDocuments();
  if (existingSessions > 0) {
    return; // Mentors already exist
  }

  // Create demo mentor users and profiles
  const demoMentors = [
    {
      clerkId: 'mentor_aditi_sharma',
      email: 'aditi.sharma@example.com',
      name: 'Aditi Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AditiSharma',
    },
    {
      clerkId: 'mentor_rohan_mehta',
      email: 'rohan.mehta@example.com',
      name: 'Rohan Mehta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohanMehta',
    },
    {
      clerkId: 'mentor_sameer_khan',
      email: 'sameer.khan@example.com',
      name: 'Sameer Khan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SameerKhan',
    },
    {
      clerkId: 'mentor_priya_singh',
      email: 'priya.singh@example.com',
      name: 'Priya Singh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSingh',
    },
    {
      clerkId: 'mentor_vikram_kumar',
      email: 'vikram.kumar@example.com',
      name: 'Vikram Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VikramKumar',
    },
    {
      clerkId: 'mentor_ananya_gupta',
      email: 'ananya.gupta@example.com',
      name: 'Ananya Gupta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaGupta',
    },
  ];

  for (const mentorData of demoMentors) {
    let user = await User.findOne({ clerkId: mentorData.clerkId });
    if (!user) {
      user = await User.create(mentorData);
    }

    // Create profile for mentor
    const profileData = {
      userId: user._id,
      careerStage: 'Professional',
      currentRole: mentorData.name.includes('Aditi') ? 'Director of Engineering' :
                   mentorData.name.includes('Rohan') ? 'Principal PM' :
                   mentorData.name.includes('Sameer') ? 'Lead Data Scientist' :
                   mentorData.name.includes('Priya') ? 'Senior UX Designer' :
                   mentorData.name.includes('Vikram') ? 'Staff Engineer' :
                   'Marketing Head',
      currentCompany: mentorData.name.includes('Aditi') ? 'Google' :
                      mentorData.name.includes('Rohan') ? 'Microsoft' :
                      mentorData.name.includes('Sameer') ? 'Amazon' :
                      mentorData.name.includes('Priya') ? 'Cred' :
                      mentorData.name.includes('Vikram') ? 'Zerodha' :
                      'Zomato',
      joinDate: 'Jul 2025',
      personalInfo: {
        linkedIn: `https://www.linkedin.com/in/${mentorData.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
      skills: mentorData.name.includes('Aditi') ? ['System Design', 'Scalability'] :
              mentorData.name.includes('Rohan') ? ['Product Strategy', 'B2B SaaS'] :
              mentorData.name.includes('Sameer') ? ['AI/ML', 'Python'] :
              mentorData.name.includes('Priya') ? ['Design Systems', 'Figma'] :
              mentorData.name.includes('Vikram') ? ['Backend', 'Golang'] :
              ['Growth', 'Brand'],
      onboardingComplete: true,
    };

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create(profileData);
    }
  }
};

// GET /api/mentors - Get all available mentors
router.get('/mentors', async (req, res) => {
  try {
    await ensureDemoMentors();

    // 1) mentors from sessions
    const mentorClerkIdsFromSessions = await MentorSession.distinct('mentorId');

    // 2) fallback: mentors from profiles
    let mentorClerkIdList: string[] = [];

    if (mentorClerkIdsFromSessions.length > 0) {
      mentorClerkIdList = mentorClerkIdsFromSessions as string[];
    } else {
      const mentorProfiles = await Profile.find({
        onboardingComplete: true,
        currentRole: { $exists: true, $ne: null },
        currentCompany: { $exists: true, $ne: null },
      })
        .populate('userId', 'clerkId')
        .limit(50)
        .lean();

      mentorClerkIdList = mentorProfiles
        .map((p: any) => p?.userId?.clerkId)
        .filter((id: any): id is string => !!id);
    }

    // ✅ de-duplicate
    mentorClerkIdList = Array.from(new Set(mentorClerkIdList));

    // Get users for these Clerk IDs
    const users = await User.find({ clerkId: { $in: mentorClerkIdList } }).lean();

    // ✅ map clerkId -> user
    const userByClerkId = new Map<string, any>();
    users.forEach(u => userByClerkId.set(u.clerkId, u));

    // IMPORTANT FIX: use ObjectIds for Profile.userId query
    const mentorUserIds = users.map(u => u._id);

    const profiles = await Profile.find({
      userId: { $in: mentorUserIds },
      onboardingComplete: true,
    })
      .populate('userId', 'name email avatar clerkId')
      .lean();

    // All sessions once
    const allSessions = await MentorSession.find({
      mentorId: { $in: mentorClerkIdList },
    }).lean();

    const mentorsRaw = await Promise.all(
      profiles.map(async (profile: any) => {
        const user = profile.userId as any;
        if (!user?.clerkId) return null;

        const mentorClerkId = user.clerkId;
        const mentorSessions = allSessions.filter((s: any) => s.mentorId === mentorClerkId);

        const completedSessions = mentorSessions.filter((s: any) => s.status === 'completed');
        const rating = completedSessions.length > 0 ? 4.9 : 4.5;
        const reviews = completedSessions.length;

        // Experience fallback
        const role = profile.currentRole || '';
        const skills = profile.skills || [];
        let experienceYears =
          role.includes('Director') ? 12 :
          role.includes('Principal') ? 9 :
          role.includes('Lead') ? 8 :
          role.includes('Senior') ? 7 :
          role.includes('Staff') ? 10 : 6;

        // Availability
        const upcomingSessions = mentorSessions.filter((s: any) =>
          s.status === 'scheduled' && new Date(s.startTime) > new Date()
        );
        let availabilityText = 'Available Now';
        if (upcomingSessions.length > 0) {
          const nextSession = upcomingSessions.sort((a: any, b: any) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )[0];
          const nextDate = new Date(nextSession.startTime);
          const daysDiff = Math.ceil((nextDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) availabilityText = 'Tomorrow';
          else availabilityText = nextDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        }

        // Domain
        let domain = 'Software';
        const roleLc = role.toLowerCase();
        const has = (k: string) => skills.some((s: string) => (s || '').toLowerCase().includes(k));
        if (roleLc.includes('design') || has('figma') || has('design')) domain = 'Design';
        else if (roleLc.includes('data') || roleLc.includes('scientist') || has('ai') || has('ml') || has('python')) domain = 'Data Science';
        else if (roleLc.includes('product') || roleLc.includes('pm') || has('saas') || has('product')) domain = 'Product';
        else if (roleLc.includes('marketing') || has('growth') || has('brand')) domain = 'Marketing';

        // Price
        const paidSessions = mentorSessions.filter((s: any) => (s.amount || 0) > 0);
        const avgPrice = paidSessions.length > 0
          ? Math.round(paidSessions.reduce((sum: number, s: any) => sum + (s.amount || 0), 0) / paidSessions.length)
          : role.includes('Director') ? 5000 :
            role.includes('Principal') ? 4200 :
            role.includes('Lead') ? 3500 :
            role.includes('Senior') ? 2800 :
            role.includes('Staff') ? 3000 : 2500;

        const name = user?.name || 'Mentor';
        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

        return {
          id: mentorClerkId, // ✅ IMPORTANT: this is what frontend uses for booking & myMentorIds
          name,
          role: profile.currentRole || 'Professional',
          company: profile.currentCompany || 'Company',
          companyLogo: '',
          avatarInitial: initials,
          rating,
          reviews: reviews || Math.floor(Math.random() * 200) + 50,
          expertise: (skills && skills.length ? skills.slice(0, 3) : ['Expertise']),
          price: avgPrice,
          availability: availabilityText,
          domain,
          experience: `${experienceYears} Yrs`,
          verified: true,
          linkedinUrl: profile.personalInfo?.linkedIn || `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
        };
      })
    );

    const mentors = mentorsRaw.filter(Boolean) as any[];

    const totalMentors = mentors.length;
    const avgHourlyRate = totalMentors > 0
      ? Math.round(mentors.reduce((sum, m) => sum + (m.price || 0), 0) / totalMentors)
      : 3200;

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const activeSessions = allSessions.filter((s: any) =>
      s.status === 'scheduled' &&
      new Date(s.startTime) >= new Date() &&
      new Date(s.startTime) <= sevenDaysFromNow
    ).length;

    const avgSatisfaction = totalMentors > 0
      ? (mentors.reduce((sum, m) => sum + (m.rating || 0), 0) / totalMentors).toFixed(1)
      : '4.9';

    return res.json({
      mentors,
      stats: {
        totalMentors: totalMentors || 124,
        avgHourlyRate,
        activeSessions: activeSessions || 18,
        satisfaction: avgSatisfaction,
      },
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});


export default router;

