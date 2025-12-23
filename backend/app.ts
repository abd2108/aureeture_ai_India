import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config(); // This MUST be at the top
import cors from 'cors';
import { CLERK_ENABLED, FRONTEND_URL, NODE_ENV } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { syncUserMiddleware } from "./middleware/syncUser.middleware";
import { roleResolverMiddleware } from "./middleware/roleResolver.middleware";
import { clerkAuthMiddleware } from "./middleware/auth.middleware";
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
    allowedHeaders: ["Content-Type", "Authorization", "x-active-role"],
    exposedHeaders: ["Authorization"],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In dev, allow a mock auth context so API calls don't 503 when Clerk keys are missing.
if (!CLERK_ENABLED && NODE_ENV !== "production") {
  console.warn("[auth] Clerk not configured; using dev auth fallback (x-mock-user-id).");
}

app.use(clerkAuthMiddleware);
app.use(syncUserMiddleware);
app.use(roleResolverMiddleware);

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
