import { Request, Response, NextFunction } from 'express';
import { clerkClient, createClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// This middleware will protect routes that require authentication
// It attaches `req.auth` which contains session and user information
export const clerkAuthMiddleware = createClerkExpressWithAuth({
    // You can add options here if needed, like authorizedParties
}).withAuth;

// Example of a custom middleware if more fine-grained control is needed
export const customAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: { message: 'Unauthorized: No token provided' }});
        }
        const token = authHeader.split(' ')[1];
        
        // The `authenticateRequest` method will verify the token and throw an error if invalid
        const requestState = await clerkClient.authenticateRequest({
            headerToken: token
        });

        // Attach auth object to the request for downstream handlers
        (req as any).auth = requestState.toAuth();
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ success: false, error: { message: 'Unauthorized: Invalid token' }});
    }
};