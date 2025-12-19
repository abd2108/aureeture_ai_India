import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { FRONTEND_URL } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Express = express();

// --- Core Middleware ---
// Enable CORS for the frontend application
app.use(cors({ 
    origin: FRONTEND_URL || 'http://localhost:3000', 
    credentials: true 
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api', apiRouter);

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- 404 Not Found Handler ---
app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: { message: 'Resource not found' } });
});

// --- Centralized Error Handler ---
app.use(errorHandler);

export default app;
