import { Router } from 'express';
import { getProjects, getProjectById, joinProject, getUserProjects } from '../controllers/project.controller';
import { customAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// GET /api/projects - Get all projects (public)
router.get('/', getProjects);

// GET /api/projects/:id - Get project by ID (public)
router.get('/:id', getProjectById);

// Protected routes require authentication
router.use(customAuthMiddleware);

// POST /api/projects/:id/join - Join a project
router.post('/:id/join', joinProject);

// GET /api/projects/me - Get user's projects
router.get('/me', getUserProjects);

export default router;



