import { Router } from 'express';
import { getChatHistory, sendMessage } from '../controllers/caro.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { chatMessageSchema } from '../utils/validationSchemas';

const router = Router();

// All CARO routes require authentication
router.use(requireAuth);


// GET /api/caro/history - Get chat history
router.get('/history', getChatHistory);

// POST /api/caro/message - Send message to CARO
router.post('/message', validateRequest(chatMessageSchema), sendMessage);

export default router;



