import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import onboardingRoutes from './onboarding.routes';
import jobRoutes from './job.routes';
import projectRoutes from './project.routes';
import peopleRoutes from './people.routes';
import caroRoutes from './caro.routes';
import mentorRoutes from './mentor.routes';
import mentorsRoutes from './mentors.routes';
import studentRoutes from './student.routes';
import sessionRoutes from './session.routes';
import contactRoutes from './contact.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/jobs', jobRoutes);
router.use('/people', peopleRoutes);
router.use('/projects', projectRoutes);
router.use('/caro', caroRoutes);
// Mentor routes - frontend expects /api/mentor-sessions, /api/mentor-mentees, etc.
// Mentor routes - these handle /api/mentor-sessions, /api/mentor-mentees, etc.
// The mentorRoutes file exports routes that match frontend expectations
router.use('/', mentorRoutes);
router.use('/', mentorsRoutes); // Handles /api/mentors (for students to browse mentors)
router.use('/', studentRoutes); // Handles /api/student/* (student-specific relationship endpoints)
router.use('/session', sessionRoutes);
router.use('/', contactRoutes); // Leads, enterprise-demo, contact

export default router;


