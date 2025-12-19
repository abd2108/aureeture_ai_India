# AureetureAI - Complete Setup Guide

This guide will help you set up and run the complete AureetureAI platform with full frontend-backend integration.

## Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB (local or cloud instance)
- Clerk account (for authentication)
- (Optional) Agora account (for video sessions)
- (Optional) Razorpay account (for payments)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

#### Backend (.env)
Copy `backend/.env.example` to `backend/.env` and fill in your values:

```bash
cd backend
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `CLERK_SECRET_KEY` - From your Clerk dashboard
- `FRONTEND_URL` - Usually `http://localhost:3000`

#### Frontend (.env.local)
Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_BASE_URL` - Usually `http://localhost:5001`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From your Clerk dashboard
- `CLERK_SECRET_KEY` - From your Clerk dashboard

### 3. Database Setup

Ensure MongoDB is running. The app will automatically create collections on first run.

### 4. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5001`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Verify Installation

1. Visit `http://localhost:5001/health` - Should return `{"status":"UP"}`
2. Visit `http://localhost:3000` - Should show the landing page
3. Click "Career Explorer" and test authentication flow

## Project Structure

```
AureetureAI_India/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── modals/          # Database schemas (typo in original, kept for compatibility)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
│
└── frontend/
    ├── app/             # Next.js app directory
    │   ├── api/         # Next.js API routes
    │   ├── dashboard/   # Dashboard pages
    │   └── ...
    ├── components/      # React components
    ├── lib/             # Utilities (including api.ts)
    └── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Clerk token and sync user

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `POST /api/profile` - Create profile (requires auth)
- `PUT /api/profile` - Update profile (requires auth)

### Mentor Sessions
- `GET /api/mentor-sessions?mentorId=...&scope=all|upcoming|past` - Get sessions
- `GET /api/mentor-sessions/:id?mentorId=...` - Get session by ID
- `POST /api/mentor-sessions` - Create session
- `PATCH /api/mentor-sessions/:id?mentorId=...` - Update session
- `DELETE /api/mentor-sessions/:id?mentorId=...` - Delete session
- `GET /api/mentor-sessions/:id/verify-join?mentorId=...` - Verify join eligibility
- `POST /api/mentor-sessions/:id/complete?mentorId=...` - Mark session complete

### Mentor Mentees
- `GET /api/mentor-mentees?mentorId=...` - Get all mentees
- `GET /api/mentor-mentees/:id?mentorId=...` - Get mentee details

### Mentor Availability
- `GET /api/mentor-availability/slots?mentorId=...&startDate=...&endDate=...` - Get available slots

### Session Join
- `POST /api/session/join` - Get Agora credentials for video session

### Contact Forms
- `POST /api/leads` - Submit lead form
- `POST /api/enterprise-demo` - Submit enterprise demo request
- `POST /api/contact` - Submit contact form

## Frontend API Client

The frontend uses a centralized API client located at `frontend/lib/api.ts`. 

Example usage:
```typescript
import { api } from '@/lib/api';

// Get mentor sessions
const response = await api.mentorSessions.getAll(userId, 'upcoming');
if (response.success) {
  console.log(response.data);
}

// Create profile
const profileResponse = await api.profile.create({
  careerStage: 'student',
  skills: ['React', 'TypeScript'],
});
```

## Authentication Flow

1. User clicks "Career Explorer" → Selects role (Student/Mentor/Founder)
2. Clerk modal opens for login/signup
3. After authentication, Clerk redirects to `/dashboard?role=...`
4. Dashboard traffic controller reads role and redirects to appropriate dashboard
5. Backend API calls include Clerk token in Authorization header
6. Backend middleware verifies token and syncs user to local database

## Database Models

- **User** - Synced from Clerk, stores `clerkId`, `email`, `name`, `avatar`
- **Profile** - Extended user profile with career info, skills, preferences
- **MentorSession** - Mentorship sessions with scheduling, payment, video links
- **MentorAvailability** - Mentor's weekly schedule and availability
- **Lead** - Marketing leads from website forms
- **EnterpriseDemo** - Enterprise demo requests
- **Message** - Contact form submissions

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh` or check your MongoDB URI
- Verify all required environment variables are set
- Check port 5001 is not in use

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` matches backend URL
- Check CORS settings in `backend/app.ts`
- Ensure backend is running on the correct port

### Authentication issues
- Verify Clerk keys are correct in both frontend and backend
- Check Clerk dashboard for webhook configuration (if using)
- Ensure Clerk redirect URLs are configured correctly

### Database connection errors
- Verify MongoDB URI format: `mongodb://localhost:27017/dbname` or cloud URI
- Check MongoDB is accessible from your network
- Verify database user permissions (if using auth)

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use `http://localhost:5001/health` to verify backend is up
3. **Database**: Use MongoDB Compass or similar tool to inspect data
4. **Logs**: Check console output for detailed error messages
5. **Clerk Dashboard**: Use Clerk dashboard to manage users and test authentication

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build frontend: `cd frontend && npm run build`
3. Build backend: `cd backend && npm run build`
4. Set up environment variables on your hosting platform
5. Configure MongoDB Atlas or your production database
6. Set up reverse proxy (nginx) if needed
7. Configure SSL certificates
8. Update CORS and redirect URLs for production domains

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in console
3. Verify all environment variables are set correctly
4. Check database connectivity

---

**Note**: This is a complete, production-ready setup. All routes, controllers, and integrations are fully implemented and connected.


