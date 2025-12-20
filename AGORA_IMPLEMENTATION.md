# Agora Video Session Implementation

This document describes the Agora video session integration for the mentor dashboard.

## Overview

The implementation provides a production-grade video session flow using Agora RTC SDK with:
- Secure token generation on the backend
- Role-based permissions (mentor = publisher, mentee = subscriber)
- Cloud recording support (mentor-controlled)
- Session lifecycle management

## Architecture

### Backend Components

1. **Agora Token Service** (`backend/src/services/agoraToken.service.ts`)
   - Generates secure RTC tokens using Agora App ID and Certificate
   - Role-based token generation (PUBLISHER for mentor, SUBSCRIBER for mentee)
   - Configurable token expiration (default: 1 hour)

2. **Session Join API** (`POST /api/session/join`)
   - Validates user authorization (mentor or mentee)
   - Generates Agora token
   - Returns session credentials (token, channel name, role, etc.)
   - Updates session status to "ongoing" when mentor joins

3. **Database Schema Updates**
   - Added `agoraChannel` field to MentorSession model
   - Added `startedAt` and `endedAt` fields for session tracking

### Frontend Components

1. **Video Session Page** (`frontend/app/dashboard/mentor/sessions/[id]/join/page.tsx`)
   - Full Agora RTC SDK integration
   - Pre-join device check
   - Auto-join channel with credentials
   - Role-based UI controls:
     - **Mentor**: Mic, Camera, Recording, End Session
     - **Mentee**: View-only (can see mentor's video/audio)
   - Real-time video/audio streaming
   - Session completion handling

## Setup Instructions

### 1. Environment Variables

Add to `backend/.env`:
```env
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
```

Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install agora-access-token
```

**Frontend:**
```bash
cd frontend
npm install agora-rtc-sdk-ng
```

### 3. Get Agora Credentials

1. Sign up at [Agora.io](https://www.agora.io/)
2. Create a new project
3. Get your App ID and App Certificate from the dashboard
4. Add them to your environment variables

## API Endpoints

### POST /api/session/join

**Request:**
```json
{
  "sessionId": "session_id",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "sessionId": "session_id",
  "channelName": "session-1234567890-abc123",
  "agoraToken": "generated_token",
  "uid": "user_id",
  "role": "mentor" | "mentee",
  "recordingEnabled": true,
  "agoraAppId": "your_app_id"
}
```

## Usage Flow

1. **User clicks "Join Session"** from mentor dashboard
2. **Frontend calls** `POST /api/session/join` with sessionId and userId
3. **Backend validates** user is mentor/mentee of session
4. **Backend generates** Agora token with appropriate role
5. **Frontend receives** credentials and initializes Agora SDK
6. **User joins** Agora channel automatically
7. **Video/audio streams** are established
8. **Mentor can control** recording, end session, etc.
9. **On leave**, session is marked as completed

## Features

### ✅ Implemented
- Secure token generation
- Role-based permissions
- Video/audio streaming
- Mic and camera controls (mentor)
- Session lifecycle management
- Auto-join channel
- Remote user handling

### 🚧 TODO (Future Enhancements)
- Cloud recording start/stop API
- Recording playback page
- Network quality indicators
- Active speaker detection
- Screen sharing
- Chat functionality
- Session recording metadata persistence

## Security Notes

- **Never expose** Agora App Certificate to frontend
- Tokens are time-bound (1 hour default)
- Role-based access control enforced
- User authorization verified before token generation
- Session access validated on every join request

## Troubleshooting

### "Agora credentials missing" error
- Ensure `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` are set in backend `.env`
- Restart backend server after adding environment variables

### "Failed to join video session"
- Check browser console for detailed error messages
- Verify microphone/camera permissions are granted
- Ensure network connectivity
- Check Agora dashboard for service status

### Video not showing
- Verify browser supports WebRTC
- Check camera permissions
- Ensure Agora SDK is properly initialized
- Check network quality

## Testing

1. Create a test session via booking flow
2. Navigate to session details page
3. Click "Join Session" button
4. Verify video/audio streams work
5. Test mic/camera toggles
6. Test leave session functionality

