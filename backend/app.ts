import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { FRONTEND_URL } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { clerkMiddleware } from "@clerk/express";
import { syncUserMiddleware } from "./middleware/syncUser.middleware";
const app: Express = express();

// --- Core Middleware ---
// Enable CORS for the frontend application
// Enable CORS for the frontend application
const allowedOrigins = [
  process.env.FRONTEND_URL,  // e.g. http://localhost:3000 OR https://yourdomain.com
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl / postman (no origin)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);




// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(syncUserMiddleware);
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
