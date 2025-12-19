import { Router } from 'express';
import MentorSession from '../models/mentorSession.model';
import MentorAvailability from '../models/mentorAvailability.model';
import { generateAgoraToken } from '../services/agoraToken.service';
import { sendEmail, generateSessionConfirmationEmail } from '../services/email.service';

const router = Router();

// Helper to ensure demo sessions exist
const ensureDemoSessionsForMentor = async (mentorId: string, forceCreate: boolean = false) => {
  const count = await MentorSession.countDocuments({ mentorId });
  if (count >= 3 && !forceCreate) return;
  
  const now = new Date();
  const timestamp = Date.now();
  const inMinutes = (mins: number) => new Date(now.getTime() + mins * 60_000);
  const inHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60_000);
  const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60_000);
  const addMinutes = (date: Date, mins: number) => new Date(date.getTime() + mins * 60_000);

  await MentorSession.create([
    {
      mentorId,
      studentName: 'Rishabh Jain',
      studentEmail: 'rishabh@example.com',
      studentId: 'student_rishabh_123',
      title: 'Frontend Portfolio Review',
      description: 'Review GitHub portfolio and improve storytelling.',
      startTime: inMinutes(30),
      endTime: inMinutes(30 + 45),
      durationMinutes: 45,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/rishabh-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-1`,
      amount: 1500,
      currency: 'INR',
      paymentId: 'pay_rishabh_001',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Priya Sharma',
      studentEmail: 'priya@example.com',
      studentId: 'student_priya_234',
      title: 'Improve React performance skills',
      description: 'Memoization, code splitting, and bundle analysis.',
      startTime: inHours(-15 * 24), // 15 days ago
      endTime: addMinutes(inHours(-15 * 24), 60),
      durationMinutes: 60,
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/priya-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-6`,
      amount: 1800,
      currency: 'INR',
      paymentId: 'pay_priya_006',
      startedAt: inHours(-15 * 24),
      endedAt: addMinutes(inHours(-15 * 24), 60),
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Priya Sharma',
      studentEmail: 'priya@example.com',
      studentId: 'student_priya_234',
      title: 'Improve React performance skills',
      description: 'Memoization, code splitting, and bundle analysis.',
      startTime: inDays(12),
      endTime: addMinutes(inDays(12), 60),
      durationMinutes: 60,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/priya-2`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-9`,
      amount: 1800,
      currency: 'INR',
      paymentId: 'pay_priya_007',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Aditi Sharma',
      studentEmail: 'aditi@example.com',
      studentId: 'student_aditi_456',
      title: 'Crack FAANG SDE role in 6 months',
      description: 'Comprehensive preparation for FAANG software engineering roles.',
      startTime: inHours(-2),
      endTime: inHours(-1),
      durationMinutes: 60,
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/aditi-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-2`,
      recordingUrl: 'https://recordings.aureeture.ai/aditi-1',
      notes: 'Strong on fundamentals. Needs crisper trade‑off communication.',
      amount: 2000,
      currency: 'INR',
      paymentId: 'pay_aditi_002',
      startedAt: inHours(-2),
      endedAt: inHours(-1),
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Aditi Sharma',
      studentEmail: 'aditi@example.com',
      studentId: 'student_aditi_456',
      title: 'Crack FAANG SDE role in 6 months',
      description: 'Comprehensive preparation for FAANG software engineering roles.',
      startTime: inDays(6),
      endTime: addMinutes(inDays(6), 60),
      durationMinutes: 60,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/aditi-2`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-7`,
      amount: 2000,
      currency: 'INR',
      paymentId: 'pay_aditi_003',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Karan Patel',
      studentEmail: 'karan@example.com',
      studentId: 'student_karan_789',
      title: 'Transition to backend engineer',
      description: 'Career transition strategy and skill development plan.',
      startTime: inHours(-8 * 24), // 8 days ago
      endTime: addMinutes(inHours(-8 * 24), 60),
      durationMinutes: 60,
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/karan-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-3`,
      amount: 1500,
      currency: 'INR',
      paymentId: 'pay_karan_003',
      startedAt: inHours(-8 * 24),
      endedAt: addMinutes(inHours(-8 * 24), 60),
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Karan Patel',
      studentEmail: 'karan@example.com',
      studentId: 'student_karan_789',
      title: 'Transition to backend engineer',
      description: 'Career transition strategy and skill development plan.',
      startTime: inDays(5),
      endTime: addMinutes(inDays(5), 60),
      durationMinutes: 60,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/karan-2`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-8`,
      amount: 1500,
      currency: 'INR',
      paymentId: 'pay_karan_004',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Sneha Kulkarni',
      studentEmail: 'sneha@example.com',
      studentId: 'student_sneha_987',
      title: 'Interview Preparation - DSA',
      description: 'Practice data structures and algorithms problems.',
      startTime: inDays(2),
      endTime: addMinutes(inDays(2), 60),
      durationMinutes: 60,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/sneha-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-4`,
      amount: 1700,
      currency: 'INR',
      paymentId: 'pay_sneha_004',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Amit',
      studentEmail: 'amit@example.com',
      studentId: 'student_amit_555',
      title: 'Mock Interview',
      description: 'Complete mock interview session.',
      startTime: inHours(-24),
      endTime: addMinutes(inHours(-24), 45),
      durationMinutes: 45,
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/amit-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-5`,
      amount: 1800,
      currency: 'INR',
      paymentId: 'pay_amit_005',
      startedAt: inHours(-24),
      endedAt: addMinutes(inHours(-24), 45),
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
  ]);
};

// GET /api/mentor/stats - Get mentor dashboard statistics
router.get('/mentor/stats', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }

    await ensureDemoSessionsForMentor(mentorId);

    // Get all sessions for this mentor
    const sessions = await MentorSession.find({ mentorId });

    // Calculate total earnings
    const completedSessions = sessions.filter(s => s.status === 'completed' && s.paymentStatus === 'paid');
    const totalEarnings = completedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);

    // Calculate earnings from last month for comparison
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const lastMonthSessions = completedSessions.filter(s => {
      const endDate = s.endedAt || s.endTime;
      return endDate && new Date(endDate) >= oneMonthAgo && new Date(endDate) < new Date();
    });
    const lastMonthEarnings = lastMonthSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
    const currentMonthSessions = completedSessions.filter(s => {
      const endDate = s.endedAt || s.endTime;
      return endDate && new Date(endDate) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    });
    const currentMonthEarnings = currentMonthSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
    const earningsChange = lastMonthEarnings > 0 
      ? Math.round(((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
      : 0;

    // Get active mentees (calculate directly from sessions)
    const allSessions = await MentorSession.find({ mentorId }).sort({ startTime: -1 });
    const menteeMap = new Map<string, any>();
    allSessions.forEach((session) => {
      const key = session.studentId || session.studentName;
      if (!menteeMap.has(key)) {
        const upcomingSessions = allSessions.filter(
          (s) => (s.studentId || s.studentName) === key && s.startTime > new Date()
        );
        const nextSession = upcomingSessions.length > 0
          ? upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
          : null;
        const completedCount = allSessions.filter(
          (s) => (s.studentId || s.studentName) === key && s.status === 'completed'
        ).length;
        let status: 'Active' | 'Paused' | 'New' = 'New';
        if (nextSession) {
          status = 'Active';
        } else if (completedCount > 0) {
          status = 'Paused';
        }
        menteeMap.set(key, { status });
      }
    });
    const activeMentees = Array.from(menteeMap.values());
    const activeMenteesCount = activeMentees.filter((m: any) => m.status === 'Active').length;
    
    // Count new requests (sessions created in last 7 days that are scheduled)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newRequests = sessions.filter(s => 
      s.status === 'scheduled' && 
      new Date(s.startTime) > new Date() &&
      new Date(s.createdAt || s.startTime) >= sevenDaysAgo
    ).length;

    // Calculate rating (mock for now - in production, this would come from reviews)
    // For demo, calculate based on completed sessions
    const rating = 4.9; // Mock rating
    const reviewCount = completedSessions.length;

    // Calculate profile visibility (based on completion rate and active sessions)
    const totalSessions = sessions.length;
    const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
    const visibility = Math.min(100, Math.round(completionRate + (activeMenteesCount * 5) + (rating * 10)));

    res.json({
      earnings: {
        total: totalEarnings,
        currency: 'INR',
        formatted: `₹${totalEarnings.toLocaleString('en-IN')}`,
        change: earningsChange,
        changeType: earningsChange >= 0 ? 'increase' : 'decrease',
      },
      mentees: {
        active: activeMenteesCount,
        total: activeMentees.length,
        newRequests,
      },
      rating: {
        value: rating,
        reviewCount,
      },
      visibility: {
        percentage: visibility,
      },
    });
  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor/pending-requests - Get pending requests and actions
router.get('/mentor/pending-requests', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }

    await ensureDemoSessionsForMentor(mentorId);

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get recent paid sessions (auto-confirmed after payment)
    // Use startTime as fallback if createdAt doesn't exist (for older sessions)
    const recentPaidSessions = await MentorSession.find({
      mentorId,
      status: 'scheduled',
      paymentStatus: 'paid',
      $or: [
        { createdAt: { $gte: twoHoursAgo } },
        { startTime: { $gte: twoHoursAgo } },
      ],
    }).sort({ createdAt: -1, startTime: -1 }).limit(5);

    // Get completed sessions without notes (need feedback)
    const sessionsNeedingFeedback = await MentorSession.find({
      mentorId,
      status: 'completed',
      $or: [
        { notes: { $exists: false } },
        { notes: null },
        { notes: '' },
      ],
      endTime: { $gte: oneDayAgo },
    }).sort({ endTime: -1 }).limit(5);

    const requests = [];

    // Add recent paid bookings
    recentPaidSessions.forEach(session => {
      const sessionTime = session.createdAt || (session as any).startTime || now;
      const timeAgo = Math.floor((now.getTime() - new Date(sessionTime).getTime()) / (1000 * 60));
      const timeAgoText = timeAgo < 1 
        ? 'Just now' 
        : timeAgo < 60 
        ? `${timeAgo} min ago` 
        : timeAgo < 1440 
        ? `${Math.floor(timeAgo / 60)} hours ago` 
        : 'Today';
      requests.push({
        id: `paid-${session._id}`,
        type: 'paid_booking',
        sessionId: String(session._id),
        name: session.studentName,
        summary: 'booked a paid session.',
        createdAt: timeAgoText,
        autoConfirmed: true,
        action: 'view_session',
      });
    });

    // Add sessions needing feedback
    sessionsNeedingFeedback.forEach(session => {
      requests.push({
        id: `feedback-${session._id}`,
        type: 'feedback_pending',
        sessionId: String(session._id),
        name: session.studentName,
        summary: `Complete feedback for ${session.studentName}'s ${session.title || 'session'}.`,
        createdAt: 'Today',
        action: 'write_feedback',
      });
    });

    res.json({ requests: requests.slice(0, 10) });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions/create-demo
router.post('/sessions/create-demo', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId, true);
    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: 1 });
    res.json({ message: 'Demo sessions created successfully', count: sessions.length, sessions });
  } catch (error) {
    console.error('Error creating demo sessions:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions
router.get('/mentor-sessions', async (req, res) => {
  try {
    const { mentorId, scope = 'all' } = req.query as {
      mentorId?: string;
      scope?: 'all' | 'upcoming' | 'past';
    };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId);
    const now = new Date();
    const query: any = { mentorId };
    if (scope === 'upcoming') {
      query.startTime = { $gte: now };
    } else if (scope === 'past') {
      query.endTime = { $lt: now };
    }
    const sessions = await MentorSession.find(query).sort({ startTime: 1 });
    const upcoming = sessions.filter(
      (s) => s.startTime >= now || (s.status === 'scheduled' || s.status === 'ongoing')
    );
    const past = sessions.filter(
      (s) => s.endTime < now || (s.status === 'completed' || s.status === 'cancelled')
    );
    res.json({ upcoming, past });
  } catch (error) {
    console.error('Error fetching mentor sessions:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions/:id
router.get('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOne({ _id: id, mentorId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session by id:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions
router.post('/mentor-sessions', async (req, res) => {
  try {
    const {
      mentorId,
      studentName,
      studentEmail,
      title,
      description,
      startTime,
      endTime,
      meetingLink,
    } = req.body;
    if (!mentorId || !studentName || !title || !startTime || !endTime) {
      return res.status(400).json({
        message: 'mentorId, studentName, title, startTime, and endTime are required.',
      });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
    }
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    const session = await MentorSession.create({
      mentorId,
      studentName,
      studentEmail,
      title,
      description,
      startTime: start,
      endTime: end,
      durationMinutes,
      meetingLink,
      status: 'scheduled',
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// PATCH /api/mentor-sessions/:id
router.patch('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const { status, startTime, endTime, notes, meetingLink, recordingUrl } = req.body;
    const update: any = {};
    if (status) {
      if (!['scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      update.status = status;
    }
    if (startTime || endTime) {
      if (!startTime || !endTime) {
        return res.status(400).json({
          message: 'Both startTime and endTime are required when rescheduling.',
        });
      }
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
      }
      update.startTime = start;
      update.endTime = end;
      update.durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    }
    if (typeof notes === 'string') update.notes = notes;
    if (typeof meetingLink === 'string') update.meetingLink = meetingLink;
    if (typeof recordingUrl === 'string') update.recordingUrl = recordingUrl;
    const session = await MentorSession.findOneAndUpdate(
      { _id: id, mentorId },
      { $set: update },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error updating mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions/:id/verify-join
router.get('/mentor-sessions/:id/verify-join', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOne({ _id: id, mentorId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    const fifteenMinutesBefore = new Date(startTime.getTime() - 15 * 60 * 1000);
    if (session.paymentStatus !== 'paid') {
      return res.status(403).json({ 
        message: 'Payment not confirmed. Cannot join session until payment is confirmed.',
        canJoin: false 
      });
    }
    if (session.status !== 'scheduled' && session.status !== 'ongoing') {
      return res.status(403).json({ 
        message: `Session is ${session.status}. Cannot join.`,
        canJoin: false 
      });
    }
    if (now > endTime) {
      return res.status(403).json({ 
        message: 'Session has ended.',
        canJoin: false 
      });
    }
    if (now < fifteenMinutesBefore) {
      const msUntilJoin = fifteenMinutesBefore.getTime() - now.getTime();
      const minutesUntilJoin = Math.ceil(msUntilJoin / (1000 * 60));
      return res.status(403).json({ 
        message: `Session hasn't started yet. You can join 15 minutes before the scheduled time.`,
        canJoin: false,
        minutesUntilJoin 
      });
    }
    if (session.status === 'scheduled' && now >= fifteenMinutesBefore) {
      await MentorSession.findByIdAndUpdate(id, { status: 'ongoing' });
      session.status = 'ongoing';
    }
    let agoraChannel = session.agoraChannel;
    if (!agoraChannel) {
      agoraChannel = `session-${session._id}`;
      await MentorSession.findByIdAndUpdate(id, { agoraChannel });
    }
    res.json({
      canJoin: true,
      meetingLink: session.meetingLink,
      sessionId: String(session._id),
      channelName: agoraChannel,
      role: 'host',
    });
  } catch (error) {
    console.error('Error verifying join:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions/:id/complete
router.post('/mentor-sessions/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOneAndUpdate(
      { _id: id, mentorId },
      { $set: { status: 'completed' } },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// DELETE /api/mentor-sessions/:id
router.delete('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const result = await MentorSession.findOneAndDelete({ _id: id, mentorId });
    if (!result) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-mentees
router.get('/mentor-mentees', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId);
    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: -1 });
    const menteeMap = new Map<string, any>();
    sessions.forEach((session) => {
      const key = session.studentId || session.studentName;
      if (!menteeMap.has(key)) {
        const allSessionsForMentee = sessions.filter(
          (s) => (s.studentId || s.studentName) === key
        );
        
        // Get the most recent completed or past session as lastSession
        const pastSessions = allSessionsForMentee.filter(
          (s) => s.status === 'completed' || s.endTime < new Date()
        );
        const lastSession = pastSessions.length > 0
          ? pastSessions.sort((a, b) => {
              const aTime = a.endedAt || a.endTime || a.startTime;
              const bTime = b.endedAt || b.endTime || b.startTime;
              return bTime.getTime() - aTime.getTime();
            })[0]
          : session; // Fallback to current session if no past sessions
        
        const upcomingSessions = allSessionsForMentee.filter(
          (s) => s.startTime > new Date()
        );
        const nextSession = upcomingSessions.length > 0
          ? upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
          : null;
        
        const completedCount = allSessionsForMentee.filter(
          (s) => s.status === 'completed'
        ).length;
        const totalCount = allSessionsForMentee.length;
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        /** * FIX START: Updated Status Logic 
         * Mentee is 'New' if they have no completed sessions AND no paid upcoming sessions.
         * Mentee is 'Active' if they have a confirmed (non-draft) upcoming session.
         **/
        let status: 'Active' | 'Paused' | 'New' = 'New';
        if (nextSession && (nextSession.status as string) !== 'draft') {
          status = 'Active';
        } else if (completedCount > 0) {
          status = 'Paused';
        } else {
          status = 'New';
        }
        /** FIX END **/

        // Format last session date: "12 Dec 2025"
        const formatLastSession = (session: any) => {
          const date = session.endedAt || session.endTime || session.startTime;
          const day = date.getDate();
          const month = date.toLocaleDateString('en-GB', { month: 'short' });
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        };

        // Format next session date: "18 Dec, 7:30 PM"
        const formatNextSession = (date: Date) => {
          const day = date.getDate();
          const month = date.toLocaleDateString('en-GB', { month: 'short' });
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          const displayMinutes = minutes.toString().padStart(2, '0');
          return `${day} ${month}, ${displayHours}:${displayMinutes} ${ampm}`;
        };

        menteeMap.set(key, {
          id: session.studentId || `mentee-${key}`,
          name: session.studentName,
          email: session.studentEmail,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.studentName)}`,
          goal: session.title || session.description || 'Career development',
          progress,
          lastSession: formatLastSession(lastSession) || 'Never',
          nextSession: (nextSession && (nextSession.status as string) !== 'draft') ? formatNextSession(nextSession.startTime) : undefined,
          status,
          studentId: session.studentId,
        });
      }
    });
    const mentees = Array.from(menteeMap.values());
    res.json({ mentees, total: mentees.length });
  } catch (error) {
    console.error('Error fetching mentor mentees:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-mentees - Add a new mentee
router.post('/mentor-mentees', async (req, res) => {
  try {
    const { mentorId, name, email, goal, status } = req.body;
    if (!mentorId || !name || !email || !goal) {
      return res.status(400).json({
        message: 'mentorId, name, email, and goal are required.',
      });
    }

    // Create a placeholder session for this mentee
    // This allows the mentee to appear in the mentees list
    // The session is scheduled far in the future as a placeholder
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year from now
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 1);

    const studentId = `student_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    const session = await MentorSession.create({
      mentorId,
      studentName: name,
      studentEmail: email,
      studentId,
      title: goal,
      description: `Mentoring relationship for ${name}`,
      startTime: futureDate,
      endTime: endDate,
      durationMinutes: 60,
      status: 'draft',
      paymentStatus: 'pending',
      bookingType: 'manual',
    });


    // Return mentee object in the format expected by frontend
    const mentee = {
      id: studentId,
      name: session.studentName,
      email: session.studentEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.studentName)}`,
      goal: session.title,
      progress: 0,
      lastSession: 'Never',
      status: 'New', // 🔑 Strictly set to 'New' for the initial return
      studentId: session.studentId,
    };

    res.status(201).json(mentee);
  } catch (error) {
    console.error('Error adding mentee:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-mentees/:id
router.get('/mentor-mentees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const sessions = await MentorSession.find({
      mentorId,
      $or: [{ studentId: id }, { studentName: { $regex: id, $options: 'i' } }],
    }).sort({ startTime: -1 });
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    const firstSession = sessions[0];
    const upcomingSessions = sessions.filter(
  (s) =>
    s.startTime > new Date() &&
    s.status as string !== 'draft'
);

    const nextSession = upcomingSessions.length > 0
      ? upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
      : null;
    const completedCount = sessions.filter((s) => s.status === 'completed').length;
    const totalCount = sessions.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    /** FIX START: Aligned detail view status logic **/
    let status: 'Active' | 'Paused' | 'New' = 'New';
    if (nextSession && (nextSession.status as string) !== 'draft') {
      status = 'Active';
    } else if (completedCount > 0) {
      status = 'Paused';
    } else {
      status = 'New';
    }
    /** FIX END **/

    const milestones = [
      {
        id: 'm1',
        title: 'Complete Data Structures & Algorithms',
        description: 'Master core DSA concepts and solve 200+ problems',
        completed: progress >= 25,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
      {
        id: 'm2',
        title: 'System Design Fundamentals',
        description: 'Learn distributed systems, scalability, and design patterns',
        completed: progress >= 50,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
      {
        id: 'm3',
        title: 'Mock Interviews',
        description: 'Complete 10 mock interviews with feedback',
        completed: progress >= 75,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
    ];
    const sessionList = sessions.slice(0, 10).map((s) => ({
      id: String(s._id),
      date: s.startTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: s.startTime > new Date() ? 'numeric' : undefined,
        minute: s.startTime > new Date() ? '2-digit' : undefined,
      }),
      title: s.title,
      status: s.status === 'completed' ? 'completed' : s.startTime > new Date() ? 'upcoming' : 'cancelled',
    }));
    const mentee = {
      id: firstSession.studentId || `mentee-${firstSession.studentName}`,
      name: firstSession.studentName,
      email: firstSession.studentEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstSession.studentName)}`,
      goal: firstSession.title || 'Career development',
      progress,
      lastSession: sessions
        .filter((s) => s.status === 'completed')
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0]
        ?.startTime.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) || 'Never',
      nextSession: nextSession
        ? nextSession.startTime.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
          })
        : undefined,
      status,
      studentId: firstSession.studentId,
      milestones,
      sessions: sessionList,
      notes: sessions.find((s) => s.notes)?.notes || undefined,
    };
    res.json(mentee);
  } catch (error) {
    console.error('Error fetching mentee details:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-availability/slots
router.get('/mentor-availability/slots', async (req, res) => {
  try {
    const { mentorId, startDate, endDate } = req.query as {
      mentorId?: string;
      startDate?: string;
      endDate?: string;
    };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const availability = await MentorAvailability.findOne({ mentorId });
    if (!availability) {
      return res.status(404).json({ message: 'Mentor availability not found' });
    }
    const slots: Array<{
      id: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
      isBooked: boolean;
    }> = [];
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const weeklySlot = availability.weeklySlots.find(
        (s) => s.day === dayName && s.isActive
      );
      if (weeklySlot) {
        const override = availability.overrideSlots.find(
          (o) => o.date.toDateString() === date.toDateString()
        );
        if (!override || !override.isBlocked) {
          const [startHour, startMin] = weeklySlot.startTime.split(':').map(Number);
          const [endHour, endMin] = weeklySlot.endTime.split(':').map(Number);
          const slotStart = new Date(date);
          slotStart.setHours(startHour, startMin, 0, 0);
          const slotEnd = new Date(date);
          slotEnd.setHours(endHour, endMin, 0, 0);
          const existingSession = await MentorSession.findOne({
            mentorId,
            startTime: { $gte: slotStart, $lt: slotEnd },
            status: { $in: ['scheduled', 'ongoing'] },
          });
          slots.push({
            id: `slot-${date.getTime()}-${startHour}`,
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            isAvailable: true,
            isBooked: !!existingSession,
          });
        }
      }
    }
    res.json({ slots });
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions/confirm-payment
router.post('/mentor-sessions/confirm-payment', async (req, res) => {
  try {
    const {
      mentorId,
      studentId,
      studentName,
      studentEmail,
      title,
      description,
      startTime,
      endTime,
      amount,
      paymentId,
      mentorEmail,
      mentorName,
    } = req.body;
    if (!mentorId || !studentName || !title || !startTime || !endTime) {
      return res.status(400).json({
        message: 'mentorId, studentName, title, startTime, and endTime are required.',
      });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
    }
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    const sessionId = `session-${Date.now()}`;
    const meetingLink = `https://meet.jit.si/aureeture-${sessionId}`;
    const agoraChannel = `session-${Date.now()}-${mentorId.slice(-8)}`;
    const session = await MentorSession.create({
      mentorId,
      studentId,
      studentName,
      studentEmail,
      title,
      description,
      startTime: start,
      endTime: end,
      durationMinutes,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink,
      agoraChannel,
      amount,
      paymentId,
      rescheduleCount: 0,
      rescheduleRequests: [],
    });
    if (studentEmail) {
      const studentEmailContent = generateSessionConfirmationEmail(
        studentName,
        title,
        mentorName || 'Your Mentor',
        start,
        end,
        meetingLink,
        false
      );
      await sendEmail({
        to: studentEmail,
        subject: studentEmailContent.subject,
        html: studentEmailContent.html,
      });
    }
    if (mentorEmail) {
      const mentorEmailContent = generateSessionConfirmationEmail(
        mentorName || 'Mentor',
        title,
        studentName,
        start,
        end,
        meetingLink,
        true
      );
      await sendEmail({
        to: mentorEmail,
        subject: mentorEmailContent.subject,
        html: mentorEmailContent.html,
      });
    }
    res.status(201).json({
      session,
      message: 'Session confirmed and notifications sent',
    });
  } catch (error) {
    console.error('Error confirming payment and creating session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});
let paymentHistory: any[] = [];

// GET /api/mentor/earnings - Get earnings data including monthly trends and payment history
router.get('/mentor/earnings', async (req, res) => {
  try {
    const { mentorId, period = 'all' } = req.query as { mentorId?: string; period?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }

    await ensureDemoSessionsForMentor(mentorId);

    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: -1 });

    // Calculate monthly earnings for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyEarnings: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]}`;
      monthlyEarnings[key] = 0;
    }

    // Calculate earnings per month from completed paid sessions
    const completedPaidSessions = sessions.filter(
      s => s.status === 'completed' && s.paymentStatus === 'paid'
    );

    completedPaidSessions.forEach(session => {
      const endDate = session.endedAt || session.endTime || session.startTime;
      const sessionDate = new Date(endDate);
      if (sessionDate >= sixMonthsAgo) {
        const monthKey = monthNames[sessionDate.getMonth()];
        if (monthlyEarnings[monthKey] !== undefined) {
          monthlyEarnings[monthKey] += session.amount || 0;
        }
      }
    });

    // Convert to array format for chart
    const earningsChartData = Object.entries(monthlyEarnings)
      .slice(-6) // Last 6 months
      .map(([month, amount]) => ({ month, amount }));

    // Calculate pending payout (scheduled sessions with paid status but not completed)
    const pendingSessions = sessions.filter(
      s => s.status === 'scheduled' && s.paymentStatus === 'paid' && s.startTime > now
    );
    const pendingPayout = pendingSessions.reduce((sum, s) => sum + (s.amount || 0), 0);

    // Calculate total paid out
    const totalPaidOut = completedPaidSessions.reduce((sum, s) => sum + (s.amount || 0), 0);

    // Calculate average hourly rate
    const totalHours = completedPaidSessions.reduce((sum, s) => {
      const duration = s.durationMinutes || 60;
      return sum + (duration / 60);
    }, 0);
    const avgHourlyRate = totalHours > 0 ? Math.round(totalPaidOut / totalHours) : 0;

    // Calculate growth percentage (compare last month to previous month)
    const currentMonth = monthNames[now.getMonth()];
    const lastMonth = monthNames[now.getMonth() === 0 ? 11 : now.getMonth() - 1];
    const currentMonthEarnings = monthlyEarnings[currentMonth] || 0;
    const previousMonthEarnings = monthlyEarnings[lastMonth] || 0;
    const growth = previousMonthEarnings > 0
      ? Math.round(((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100)
      : 0;

    // Filter by period if specified (filter before formatting dates)
    let filteredSessions = completedPaidSessions;
    if (period === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredSessions = filteredSessions.filter(s => {
        const endDate = s.endedAt || s.endTime || s.startTime;
        return new Date(endDate) >= startOfMonth;
      });
    } else if (period === 'last_90_days') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filteredSessions = filteredSessions.filter(s => {
        const endDate = s.endedAt || s.endTime || s.startTime;
        return new Date(endDate) >= ninetyDaysAgo;
      });
    }

    // Get payment history (transactions) from filtered sessions
    paymentHistory = filteredSessions.map(session => {
      const endDate = session.endedAt || session.endTime || session.startTime;
      const sessionDate = new Date(endDate);
      
      // Format date: "12 Dec 2025"
      const day = sessionDate.getDate();
      const month = monthNames[sessionDate.getMonth()];
      const year = sessionDate.getFullYear();
      const formattedDate = `${day} ${month} ${year}`;

      // Format service name
      const duration = session.durationMinutes || 60;
      const serviceName = session.title || `${duration} min session`;

      return {
        id: `TXN-${session._id.toString().slice(-4)}`,
        date: formattedDate,
        student: session.studentName,
        service: serviceName,
        amount: `₹${(session.amount || 0).toLocaleString('en-IN')}`,
        status: session.paymentStatus === 'paid' ? 'Paid' : 'Pending',
        sessionId: session._id.toString(),
      };
    });

    // Sort by date descending
    paymentHistory.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    res.json({
      earningsChart: earningsChartData,
      growth,
      pendingPayout,
      totalPaidOut,
      totalSessions: completedPaidSessions.length,
      avgHourlyRate,
      paymentHistory,
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// ============================================
// STUDENT SESSION ENDPOINTS
// ============================================

// GET /api/student-sessions - Get all sessions for a student
router.get('/student-sessions', async (req, res) => {
  try {
    const { studentId, scope = 'all' } = req.query as {
      studentId?: string;
      scope?: 'all' | 'upcoming' | 'past';
    };
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const now = new Date();
    const query: any = { studentId };
    
    if (scope === 'upcoming') {
      query.startTime = { $gte: now };
      query.status = { $in: ['scheduled', 'ongoing'] };
    } else if (scope === 'past') {
      query.$or = [
        { endTime: { $lt: now } },
        { status: { $in: ['completed', 'cancelled'] } }
      ];
    }

    const sessions = await MentorSession.find(query).sort({ startTime: -1 });
    
    // Format sessions to include all necessary fields including notes
    const formatSession = (s: any) => ({
      id: s._id.toString(),
      mentorId: s.mentorId,
      title: s.title,
      description: s.description,
      startTime: s.startTime,
      endTime: s.endTime,
      durationMinutes: s.durationMinutes,
      status: s.status,
      paymentStatus: s.paymentStatus,
      meetingLink: s.meetingLink,
      recordingUrl: s.recordingUrl,
      notes: s.notes || null, // Include notes so students can see mentor feedback
      amount: s.amount,
      currency: s.currency || 'INR',
    });

    const upcoming = sessions
      .filter(
        (s) => s.startTime >= now && (s.status === 'scheduled' || s.status === 'ongoing')
      )
      .map(formatSession);

    const past = sessions
      .filter(
        (s) => s.endTime < now || s.status === 'completed' || s.status === 'cancelled'
      )
      .map(formatSession);

    res.json({ upcoming, past, total: sessions.length });
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/student-sessions/:id - Get a specific session by ID for a student
router.get('/student-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query as { studentId?: string };
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }
    
    const session = await MentorSession.findOne({ _id: id, studentId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Format response for student view - include all fields including notes
    res.json({
      id: session._id.toString(),
      mentorId: session.mentorId,
      title: session.title,
      description: session.description,
      startTime: session.startTime,
      endTime: session.endTime,
      durationMinutes: session.durationMinutes,
      status: session.status,
      paymentStatus: session.paymentStatus,
      meetingLink: session.meetingLink,
      recordingUrl: session.recordingUrl,
      notes: session.notes || null, // Include notes so students can see mentor feedback
      amount: session.amount,
      currency: session.currency || 'INR',
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching student session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

export default router;