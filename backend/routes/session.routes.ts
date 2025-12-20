import { Router } from 'express';
import MentorSession from '../models/mentorSession.model';
import { generateAgoraToken } from '../services/agoraToken.service';

const router = Router();

// POST /api/session/join
router.post('/join', async (req, res) => {
  try {
    const { sessionId, userId } = req.body as { sessionId?: string; userId?: string };
    if (!sessionId || !userId) {
      return res.status(400).json({ message: 'sessionId and userId are required' });
    }
    const session = await MentorSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    const isMentor = session.mentorId === userId;
    const isMentee = session.studentId === userId;
    if (!isMentor && !isMentee) {
      return res.status(403).json({ message: 'Unauthorized. You are not part of this session.' });
    }
    if (session.status !== 'scheduled' && session.status !== 'ongoing') {
      return res.status(403).json({ 
        message: `Session is ${session.status}. Cannot join.`,
      });
    }
    let agoraChannel = session.agoraChannel;
    if (!agoraChannel) {
      agoraChannel = `session-${session._id}`;
      await MentorSession.findByIdAndUpdate(sessionId, { agoraChannel });
    }
    const role = isMentor ? 'mentor' : 'mentee';
    
    // Generate Agora token
    let agoraToken: string;
    try {
      agoraToken = generateAgoraToken({
        channelName: agoraChannel,
        uid: userId,
        role,
        expireInSeconds: 3600,
      });
    } catch (error: any) {
      console.error('Error generating Agora token:', error);
      return res.status(500).json({ 
        message: error.message || 'Failed to generate session token. Please check Agora configuration.' 
      });
    }
    
    if (isMentor && session.status === 'scheduled') {
      await MentorSession.findByIdAndUpdate(sessionId, { 
        status: 'ongoing',
        startedAt: new Date(),
      });
    }
    
    const agoraAppId = process.env.AGORA_APP_ID;
    if (!agoraAppId && process.env.NODE_ENV === 'production') {
      return res.status(500).json({ 
        message: 'Agora App ID is not configured. Please set AGORA_APP_ID in environment variables.' 
      });
    }
    
    res.json({
      sessionId: String(session._id),
      channelName: agoraChannel,
      agoraToken,
      uid: userId,
      role,
      recordingEnabled: isMentor,
      agoraAppId: agoraAppId || 'mock-app-id',
    });
  } catch (error: any) {
    console.error('Error joining session:', error);
    res.status(500).json({ 
      message: error.message || 'An error occurred while joining the session.' 
    });
  }
});

export default router;

