import { Router } from 'express';
import { getProfile, updateProfile, createProfile } from '../controllers/profile.controller';
import { customAuthMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createProfileSchema, updateProfileSchema } from '../utils/validationSchemas';

const router = Router();

// All profile routes require authentication
router.use(customAuthMiddleware);

// GET /api/profile
router.get('/', getProfile);

// POST /api/profile
router.post('/', validateRequest(createProfileSchema), createProfile);

// PUT /api/profile
router.put('/', validateRequest(updateProfileSchema), updateProfile);

// GET /api/profile/student - Get student profile with all data formatted
router.get('/student', async (req: any, res: any) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    let profile = await ProfileService.getUserProfile(userId);
    
    // If profile doesn't exist, create a default one
    if (!profile) {
      const user = await (await import('../models/user.model')).default.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      profile = await ProfileService.createUserProfile(userId, {
        careerStage: 'Professional',
        longTermGoal: 'Become a lead animator',
        currentRole: 'Animator',
        currentCompany: 'Disney',
        joinDate: 'Jul 2025',
        personalInfo: {
          location: 'Mumbai, India',
        },
        skills: ['3D Animation', 'Maya', 'Blender', 'After Effects', 'Storytelling'],
        tasks: {
          todo: [],
          later: [],
          done: [],
        },
        careerGoals: [
          { name: 'Portfolio', progress: 75 },
          { name: 'Networking', progress: 60 },
          { name: 'Skills', progress: 90 },
          { name: 'Experience', progress: 45 },
        ],
        analytics: {
          profileCompletion: 85,
          skillScore: 847,
          views: 127,
          connects: 89,
          applications: 12,
          matches: 24,
        },
      });
    }

    // Format timeline items from workHistory, education, and projects
    const timelineItems = [];
    
    // Add work history
    if (profile.workHistory && profile.workHistory.length > 0) {
      profile.workHistory.forEach((work: any) => {
        timelineItems.push({
          id: `work-${work._id || Date.now()}`,
          type: 'work',
          title: work.role,
          subtitle: work.company,
          description: work.description || '',
          startDate: work.from,
          endDate: work.to,
          isCurrent: !work.to,
        });
      });
    }
    
    // Add education
    if (profile.education && profile.education.length > 0) {
      profile.education.forEach((edu: any) => {
        timelineItems.push({
          id: `edu-${edu._id || Date.now()}`,
          type: 'education',
          title: edu.degree,
          subtitle: edu.institution,
          description: '',
          startDate: edu.from,
          endDate: edu.to,
          isCurrent: !edu.to,
        });
      });
    }
    
    // Add projects
    if (profile.projects && profile.projects.length > 0) {
      profile.projects.forEach((project: any) => {
        timelineItems.push({
          id: `project-${project._id || Date.now()}`,
          type: 'project',
          title: project.name,
          subtitle: 'Personal Project',
          description: project.description || '',
          startDate: undefined,
          endDate: undefined,
          isCurrent: false,
        });
      });
    }

    // Get user info - ensure profile is populated
    const userDoc = await (await import('../models/user.model')).default.findById((profile as any).userId);
    const user = userDoc || (profile as any).userId;
    
    // Format response with actual user data
    const response = {
      personalInfo: {
        name: user?.name || (typeof user === 'object' && user?.name) || 'Your name',
        email: user?.email || (typeof user === 'object' && user?.email) || '',
        phone: profile.personalInfo?.phone || '',
        location: profile.personalInfo?.location || profile.preferences?.location?.[0] || 'Your city',
        linkedin: profile.personalInfo?.linkedIn || '',
      },
      careerSnapshot: {
        careerStage: profile.careerStage || 'Professional',
        longTermGoal: profile.longTermGoal || 'Become a lead animator',
        currentRole: profile.currentRole || 'Animator',
        currentCompany: profile.currentCompany || 'Disney',
        joinDate: profile.joinDate || 'Jul 2025',
      },
      timelineItems: timelineItems.sort((a, b) => {
        const aDate = a.isCurrent ? new Date() : (a.endDate || a.startDate || new Date(0));
        const bDate = b.isCurrent ? new Date() : (b.endDate || b.startDate || new Date(0));
        return bDate.getTime() - aDate.getTime();
      }),
      skills: profile.skills || [],
      tasks: profile.tasks || {
        todo: [],
        later: [],
        done: [],
      },
      careerGoals: profile.careerGoals || [
        { name: 'Portfolio', progress: 75 },
        { name: 'Networking', progress: 60 },
        { name: 'Skills', progress: 90 },
        { name: 'Experience', progress: 45 },
      ],
      analytics: profile.analytics || {
        profileCompletion: 85,
        skillScore: 847,
        views: 127,
        connects: 89,
        applications: 12,
        matches: 24,
      },
    };

    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ success: false, message: error.message || 'An error occurred' });
  }
});

// PUT /api/profile/student - Update student profile
router.put('/student', async (req: any, res: any) => {
  try {
    const userId = req.auth.userId;
    const updateData = req.body;

    // Map frontend data structure to backend model
    const profileUpdate: any = {};

    if (updateData.personalInfo) {
      profileUpdate.personalInfo = {
        phone: updateData.personalInfo.phone,
        linkedIn: updateData.personalInfo.linkedin,
        location: updateData.personalInfo.location,
      };
    }

    if (updateData.careerSnapshot) {
      profileUpdate.careerStage = updateData.careerSnapshot.careerStage;
      profileUpdate.longTermGoal = updateData.careerSnapshot.longTermGoal;
      profileUpdate.currentRole = updateData.careerSnapshot.currentRole;
      profileUpdate.currentCompany = updateData.careerSnapshot.currentCompany;
      profileUpdate.joinDate = updateData.careerSnapshot.joinDate;
    }

    if (updateData.skills) {
      profileUpdate.skills = updateData.skills;
    }

    if (updateData.tasks) {
      profileUpdate.tasks = updateData.tasks;
    }

    if (updateData.careerGoals) {
      profileUpdate.careerGoals = updateData.careerGoals;
    }

    if (updateData.analytics) {
      profileUpdate.analytics = updateData.analytics;
    }

    // Handle timeline items - convert to workHistory, education, projects
    if (updateData.timelineItems) {
      const workHistory: any[] = [];
      const education: any[] = [];
      const projects: any[] = [];

      updateData.timelineItems.forEach((item: any) => {
        if (item.type === 'work') {
          workHistory.push({
            role: item.title,
            company: item.subtitle,
            description: item.description,
            from: item.startDate,
            to: item.isCurrent ? undefined : item.endDate,
          });
        } else if (item.type === 'education') {
          education.push({
            degree: item.title,
            institution: item.subtitle,
            from: item.startDate,
            to: item.isCurrent ? undefined : item.endDate,
          });
        } else if (item.type === 'project') {
          projects.push({
            name: item.title,
            description: item.description,
          });
        }
      });

      if (workHistory.length > 0) profileUpdate.workHistory = workHistory;
      if (education.length > 0) profileUpdate.education = education;
      if (projects.length > 0) profileUpdate.projects = projects;
    }

    const profile = await ProfileService.updateUserProfile(userId, profileUpdate);
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ success: false, message: error.message || 'An error occurred' });
  }
});

export default router;


