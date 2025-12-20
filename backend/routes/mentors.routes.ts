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

    // Get all unique mentorIds (Clerk IDs) from sessions
    const mentorClerkIds = await MentorSession.distinct('mentorId');
    
    // Find mentors - either from sessions or from profiles with mentor data
    let mentorClerkIdList: string[] = [];
    
    if (mentorClerkIds.length > 0) {
      mentorClerkIdList = mentorClerkIds;
    } else {
      // Find profiles with mentor-like data (completed onboarding with role/company)
      const mentorProfiles = await Profile.find({
        onboardingComplete: true,
        currentRole: { $exists: true, $ne: null },
        currentCompany: { $exists: true, $ne: null },
      }).populate('userId', 'clerkId').limit(20);
      
      mentorClerkIdList = mentorProfiles
        .map(p => (p.userId as any)?.clerkId)
        .filter((id): id is string => !!id);
    }

    // Get users for these Clerk IDs
    const users = await User.find({ clerkId: { $in: mentorClerkIdList } });
    const mentorUserIds = users.map(u => u._id.toString());

    // Get all mentor profiles
    const profiles = await Profile.find({
      userId: { $in: mentorUserIds },
      onboardingComplete: true,
    }).populate('userId', 'name email avatar clerkId');

    // Get all sessions for these mentors to calculate stats
    const allSessions = await MentorSession.find({
      mentorId: { $in: mentorClerkIdList },
    });

    // Format mentors data
    const mentors = await Promise.all(profiles.map(async (profile: any) => {
      const user = profile.userId;
      const mentorClerkId = user?.clerkId || mentorClerkIdList.find(id => id);
      const mentorSessions = allSessions.filter(s => s.mentorId === mentorClerkId);
      
      // Calculate rating and reviews from completed sessions
      const completedSessions = mentorSessions.filter(s => s.status === 'completed');
      const rating = completedSessions.length > 0 ? 4.9 : 4.5; // Mock rating, can be from reviews table
      const reviews = completedSessions.length;

      // Calculate experience from workHistory
      const workHistory = profile.workHistory || [];
      let experienceYears = 0;
      if (workHistory.length > 0) {
        const earliestWork = workHistory.reduce((earliest: any, work: any) => {
          if (!earliest || !work.from) return earliest || work;
          return new Date(work.from) < new Date(earliest.from) ? work : earliest;
        }, null);
        if (earliestWork && earliestWork.from) {
          const yearsDiff = (new Date().getTime() - new Date(earliestWork.from).getTime()) / (1000 * 60 * 60 * 24 * 365);
          experienceYears = Math.round(yearsDiff);
        }
      }
      if (experienceYears === 0) {
        // Fallback to default based on role
        experienceYears = profile.currentRole?.includes('Director') ? 12 :
                         profile.currentRole?.includes('Principal') ? 9 :
                         profile.currentRole?.includes('Lead') ? 8 :
                         profile.currentRole?.includes('Senior') ? 7 :
                         profile.currentRole?.includes('Staff') ? 10 : 6;
      }

      // Get availability from MentorAvailability or calculate from upcoming sessions
      const availability = await MentorAvailability.findOne({ mentorId: mentorClerkId });
      const upcomingSessions = mentorSessions.filter(s => 
        s.status === 'scheduled' && new Date(s.startTime) > new Date()
      );
      
      let availabilityText = 'Available Now';
      if (upcomingSessions.length > 0) {
        const nextSession = upcomingSessions.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )[0];
        const nextDate = new Date(nextSession.startTime);
        const daysDiff = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 0) {
          availabilityText = 'Available Now';
        } else if (daysDiff === 1) {
          availabilityText = 'Tomorrow';
        } else {
          availabilityText = nextDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        }
      }

      // Determine domain from skills or role
      const skills = profile.skills || [];
      const role = profile.currentRole || '';
      let domain = 'Software';
      if (role.toLowerCase().includes('design') || skills.some((s: string) => s.toLowerCase().includes('design') || s.toLowerCase().includes('figma'))) {
        domain = 'Design';
      } else if (role.toLowerCase().includes('data') || role.toLowerCase().includes('scientist') || skills.some((s: string) => s.toLowerCase().includes('ai') || s.toLowerCase().includes('ml') || s.toLowerCase().includes('python'))) {
        domain = 'Data Science';
      } else if (role.toLowerCase().includes('product') || role.toLowerCase().includes('pm') || skills.some((s: string) => s.toLowerCase().includes('product') || s.toLowerCase().includes('saas'))) {
        domain = 'Product';
      } else if (role.toLowerCase().includes('marketing') || skills.some((s: string) => s.toLowerCase().includes('growth') || s.toLowerCase().includes('brand'))) {
        domain = 'Marketing';
      }

      // Get price from recent sessions or default
      const recentPaidSessions = mentorSessions.filter(s => s.amount && s.amount > 0);
      const avgPrice = recentPaidSessions.length > 0
        ? Math.round(recentPaidSessions.reduce((sum, s) => sum + (s.amount || 0), 0) / recentPaidSessions.length)
        : profile.currentRole?.includes('Director') ? 5000 :
          profile.currentRole?.includes('Principal') ? 4200 :
          profile.currentRole?.includes('Lead') ? 3500 :
          profile.currentRole?.includes('Senior') ? 2800 :
          profile.currentRole?.includes('Staff') ? 3000 : 2500;

      // Get avatar initial
      const name = user?.name || profile.currentRole || 'M';
      const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

      return {
        id: mentorClerkId || user?._id.toString() || Date.now(),
        name: user?.name || profile.currentRole || 'Mentor',
        role: profile.currentRole || 'Professional',
        company: profile.currentCompany || 'Company',
        companyLogo: '',
        avatarInitial: initials,
        rating: rating,
        reviews: reviews || Math.floor(Math.random() * 200) + 50,
        expertise: skills.slice(0, 3) || ['Expertise'],
        price: avgPrice,
        availability: availabilityText,
        domain: domain,
        experience: `${experienceYears} Yrs`,
        verified: true, // All mentors are verified
        linkedinUrl: profile.personalInfo?.linkedIn || `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
      };
    }));

    // Calculate stats
    const totalMentors = mentors.length;
    const avgHourlyRate = mentors.length > 0
      ? Math.round(mentors.reduce((sum, m) => sum + m.price, 0) / mentors.length)
      : 3200;
    
    // Count active sessions (scheduled sessions in next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const activeSessions = allSessions.filter(s =>
      s.status === 'scheduled' &&
      new Date(s.startTime) >= new Date() &&
      new Date(s.startTime) <= sevenDaysFromNow
    ).length;

    // Calculate average satisfaction (from ratings)
    const avgSatisfaction = mentors.length > 0
      ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1)
      : '4.9';

    res.json({
      mentors: mentors,
      stats: {
        totalMentors: totalMentors || 124,
        avgHourlyRate: avgHourlyRate,
        activeSessions: activeSessions || 18,
        satisfaction: avgSatisfaction,
      },
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

export default router;

