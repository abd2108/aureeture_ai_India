import { Router } from 'express';
import { submitOnboardingStep, getOnboardingStatus } from '../controllers/onboarding.controller';
import { customAuthMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { onboardingStepSchema } from '../utils/validationSchemas';

const router = Router();

// All onboarding routes require authentication
router.use(customAuthMiddleware);

// GET /api/onboarding/status
router.get('/status', getOnboardingStatus);

// POST /api/onboarding/step
router.post('/step', validateRequest(onboardingStepSchema), submitOnboardingStep);

export default router;



