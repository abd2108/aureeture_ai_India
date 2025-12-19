import { Router } from 'express';
import { verifyClerkToken } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { verifyTokenSchema } from '../utils/validationSchemas';

const router = Router();

// POST /api/auth/verify
router.post('/verify', validateRequest(verifyTokenSchema), verifyClerkToken);

export default router;



