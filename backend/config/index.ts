import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';
export const REDIS_URL = process.env.REDIS_URL || '';
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || '';
export const CLERK_PUBLISHABLE_KEY =
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    '';
export const CLERK_ENABLED = Boolean(CLERK_SECRET_KEY && CLERK_PUBLISHABLE_KEY);
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Only exit if critical variables are missing
if (!MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is required.");
    process.exit(1);
}

if (NODE_ENV === 'production') {
    if (!CLERK_SECRET_KEY || !FRONTEND_URL) {
        console.error("FATAL ERROR: CLERK_SECRET_KEY and FRONTEND_URL are required in production.");
        process.exit(1);
    }
}

if (NODE_ENV !== 'production' && !CLERK_ENABLED) {
    // eslint-disable-next-line no-console
    console.warn("[auth] Clerk keys are missing; auth middleware will be disabled in dev.");
}


