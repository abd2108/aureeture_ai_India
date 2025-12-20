import { Router } from 'express';
import { getJobs, getJobById, applyToJob, getUserApplications } from '../controllers/job.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { jobApplicationSchema } from '../utils/validationSchemas';

const router = Router();

// GET /api/jobs - Get all jobs (public)
router.get('/', getJobs);

// GET /api/jobs/:id - Get job by ID (public)
router.get('/:id', getJobById);

// Protected routes require authentication
router.use(requireAuth);


// POST /api/jobs/:id/apply - Apply to a job
router.post('/:id/apply', validateRequest(jobApplicationSchema), applyToJob);

// GET /api/jobs/applications/me - Get user's applications
router.get('/applications/me', getUserApplications);

export default router;



