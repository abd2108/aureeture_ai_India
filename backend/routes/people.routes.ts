import { Router } from 'express';
import { getPeople, sendConnectionRequest, getConnections, respondToConnection } from '../controllers/people.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { connectionRequestSchema, connectionResponseSchema } from '../utils/validationSchemas';

const router = Router();

// All people routes require authentication
router.use(requireAuth);


// GET /api/people - Get people suggestions
router.get('/', getPeople);

// GET /api/people/connections - Get user's connections
router.get('/connections', getConnections);

// POST /api/people/connect - Send connection request
router.post('/connect', validateRequest(connectionRequestSchema), sendConnectionRequest);

// PUT /api/people/connections/:id - Respond to connection request
router.put('/connections/:id', validateRequest(connectionResponseSchema), respondToConnection);

export default router;



