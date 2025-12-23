import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import MentorSession from '../models/mentorSession.model';
import MentorAvailability from '../models/mentorAvailability.model';
import MenteePlan from '../models/menteePlan.model';
import MenteeMessage from '../models/menteeMessage.model';
import Mentorship from '../models/mentorship.model';
import { generateAgoraToken } from '../services/agoraToken.service';
import { sendEmail, generateSessionConfirmationEmail } from '../services/email.service';
import { requireRole } from '../middleware/requireRole.middleware';

const router = Router();

// FIX: Role-aware guard updated to allow students to access confirm-payment
router.use((req, res, next) => {
  const path = req.path || "";
  
  // ALLOW: confirm-payment must be accessible by students after they pay
  // Use endsWith or regex to be more robust against mounting differences
  if (path.includes("/mentor-sessions/confirm-payment")) {
    return next();
  }

  if (path.startsWith("/mentor-sessions") || path.startsWith("/mentor/")) {
    return requireRole("mentor")(req, res, next);
  }
  if (path.startsWith("/student-sessions")) {
    return requireRole("student")(req, res, next);
  }
  return next();
});


const upsertMentorshipFromSession = async (mentorId: string, studentId?: string, studentEmail?: string, studentName?: string, title?: string) => {
  if (!mentorId) return;
  const menteeClerkId = studentId || undefined;
  const menteeEmail = (studentEmail || "").toLowerCase() || undefined;

  if (!menteeClerkId && !menteeEmail) return;

  const query: any = { mentorId };
  if (menteeClerkId) query.menteeClerkId = menteeClerkId;
  else query.menteeEmail = menteeEmail;

  await Mentorship.findOneAndUpdate(
    query,
    {
      $setOnInsert: {
        mentorId,
        menteeClerkId,
        menteeEmail,
        status: "active",
      },
      $set: {
        ...(studentName ? { menteeName: studentName } : {}),
        ...(title ? { goal: title } : {}),
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
};

/**
 * Ensure we have Mentorship documents for any sessions that already exist.
 * This keeps backward compatibility with the previous "sessions-derived mentees" behavior.
 */
const ensureMentorshipsFromSessions = async (mentorId: string) => {
  const sessions = await MentorSession.find({ mentorId }).select('studentId studentEmail studentName title').lean();
  for (const s of sessions) {
    const menteeEmail = (s.studentEmail || '').toLowerCase();
    const menteeClerkId = s.studentId || undefined;
    if (!menteeEmail && !menteeClerkId) continue;

    const query: any = { mentorId };
    if (menteeClerkId) query.menteeClerkId = menteeClerkId;
    else query.menteeEmail = menteeEmail;

    const update: any = {
  $setOnInsert: {
    mentorId,
    menteeClerkId,
    menteeEmail,
    status: 'active',
    // only defaults here (no conflict)
    ...(s.studentName ? {} : { menteeName: 'Mentee' }),
    ...(s.title ? {} : { goal: 'Career development' }),
  },
  $set: {
    // always keep in sync when provided
    ...(s.studentName ? { menteeName: s.studentName } : {}),
    ...(s.title ? { goal: s.title } : {}),
    updatedAt: new Date(),
  },
};


    const mentorship = await Mentorship.findOneAndUpdate(query, update, {
      upsert: true,
      new: true,
    });

    // Link legacy plan docs (keyed by sessionId) to mentorshipId so future calls are stable
    await MenteePlan.updateMany(
      { mentorId, sessionId: (s as any)._id, mentorshipId: { $exists: false } },
      { $set: { mentorshipId: mentorship._id } }
    ).catch(() => undefined);
  }
};

const getOrCreatePlanByMentorship = async (mentorId: string, mentorshipId: mongoose.Types.ObjectId) => {
  const existing = await MenteePlan.findOne({ mentorId, mentorshipId });
  if (existing) return existing;
  return MenteePlan.create({ mentorId, mentorshipId, progress: 0, milestones: [], notes: '' });
};

const shouldSeedDemo = process.env.ENABLE_DEMO_SESSIONS === 'true';

// Helper to ensure demo sessions exist (only when explicitly enabled)
const ensureDemoSessionsForMentor = async (mentorId: string, forceCreate: boolean = false) => {
  if (!shouldSeedDemo && !forceCreate) return;
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

    const requests: any[] = [];

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

// --- Mentor ↔ Mentee mapping & plan endpoints ---

// GET /api/mentor-mentees
// Returns "mentees" derived from Mentorship (stable mapping). For backward compatibility,
// we also auto-create mentorship rows from existing MentorSession records.
router.get('/mentor-mentees', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });

    await ensureDemoSessionsForMentor(mentorId);
    await ensureMentorshipsFromSessions(mentorId);

    const mentorships = await Mentorship.find({ mentorId }).sort({ updatedAt: -1 }).lean();
    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: -1 }).lean();

    const byKey = (m: any) => m.menteeClerkId || m.menteeEmail;
    const formatLast = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };
    const formatNext = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'short' });
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${day} ${month}, ${displayHours}:${displayMinutes} ${ampm}`;
    };

    // Load all plans for this mentor keyed by mentorshipId (fast)
    const planDocs = await MenteePlan.find({ mentorId, mentorshipId: { $exists: true } }).lean();
    const planByMentorship = new Map<string, any>(planDocs.map((p: any) => [String(p.mentorshipId), p]));

    const mentees = mentorships.map((m: any) => {
      const key = byKey(m);
      const related = sessions.filter((s: any) => {
        if (m.menteeClerkId && s.studentId === m.menteeClerkId) return true;
        if (m.menteeEmail && (s.studentEmail || '').toLowerCase() === (m.menteeEmail || '').toLowerCase()) return true;
        return false;
      });

      const now = new Date();
      const past = related.filter((s: any) => s.status === 'completed' || new Date(s.endTime) < now);
      const last = past.length ? past.sort((a: any, b: any) => new Date((b.endedAt || b.endTime || b.startTime)).getTime() - new Date((a.endedAt || a.endTime || a.startTime)).getTime())[0] : null;

      const upcoming = related.filter((s: any) => new Date(s.startTime) > now && String(s.status) !== 'draft');
      const next = upcoming.length ? upcoming.sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] : null;

      const completedCount = related.filter((s: any) => s.status === 'completed').length;
      const totalCount = related.filter((s: any) => String(s.status) !== 'draft').length;
      const computedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const plan = planByMentorship.get(String(m._id));
      const progress = typeof plan?.progress === 'number' ? plan.progress : computedProgress;

      let status: 'Active' | 'Paused' | 'New' = 'New';
      if (next) status = 'Active';
      else if (completedCount > 0) status = 'Paused';

      return {
        id: String(m._id),
        name: m.menteeName,
        email: m.menteeEmail,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.menteeName || 'Mentee')}`,
        goal: m.goal || 'Career development',
        progress,
        lastSession: last ? formatLast(new Date(last.endedAt || last.endTime || last.startTime)) : 'Never',
        nextSession: next ? formatNext(new Date(next.startTime)) : undefined,
        status,
        studentId: m.menteeClerkId,
      };
    });

    return res.json({ mentees, total: mentees.length });
  } catch (error) {
    console.error('Error fetching mentor mentees:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-mentees - Add a new mentee (creates mentorship + plan)
router.post('/mentor-mentees', async (req, res) => {
  try {
    const { mentorId, name, email, goal, status } = req.body as {
      mentorId?: string;
      name?: string;
      email?: string;
      goal?: string;
      status?: 'Active' | 'Paused' | 'New';
    };
    if (!mentorId || !name || !email || !goal) {
      return res.status(400).json({ message: 'mentorId, name, email, and goal are required.' });
    }

    const mentorship = await Mentorship.findOneAndUpdate(
      { mentorId, menteeEmail: email.toLowerCase() },
      {
        $setOnInsert: {
          mentorId,
          menteeEmail: email.toLowerCase(),
        },
        $set: {
          menteeName: name,
          goal,
          status: status === 'Paused' ? 'paused' : status === 'Active' ? 'active' : 'invited',
        },
      },
      { upsert: true, new: true }
    );

    await getOrCreatePlanByMentorship(mentorId, mentorship._id);

    return res.status(201).json({
      id: String(mentorship._id),
      name: mentorship.menteeName,
      email: mentorship.menteeEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mentorship.menteeName || 'Mentee')}`,
      goal: mentorship.goal,
      progress: 0,
      lastSession: 'Never',
      status: 'New',
      studentId: mentorship.menteeClerkId,
    });
  } catch (error) {
    console.error('Error adding mentee:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-mentees/:id (id = mentorshipId)
router.get('/mentor-mentees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mentee id' });

    const mentorship = await Mentorship.findOne({ _id: id, mentorId }).lean();
    if (!mentorship) return res.status(404).json({ message: 'Mentee not found' });

    const plan = await getOrCreatePlanByMentorship(mentorId, new mongoose.Types.ObjectId(id));
    const sessions = await MentorSession.find({
      mentorId,
      $or: [
        ...(mentorship.menteeClerkId ? [{ studentId: mentorship.menteeClerkId }] : []),
        ...(mentorship.menteeEmail ? [{ studentEmail: mentorship.menteeEmail }] : []),
      ],
    }).sort({ startTime: -1 }).lean();

    const now = new Date();
    const upcomingSessions = sessions.filter((s: any) => new Date(s.startTime) > now && String(s.status) !== 'draft');
    const nextSession = upcomingSessions.length ? upcomingSessions.sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] : null;
    const completedCount = sessions.filter((s: any) => s.status === 'completed').length;

    let status: 'Active' | 'Paused' | 'New' = 'New';
    if (nextSession) status = 'Active';
    else if (completedCount > 0) status = 'Paused';

    const milestones = (plan.milestones || []).map((m: any) => ({
      id: String(m._id),
      title: m.title,
      description: m.description,
      completed: !!m.completed,
      dueDate: m.dueDate,
    }));

    const sessionList = sessions.slice(0, 10).map((s: any) => ({
      id: String(s._id),
      date: new Date(s.startTime).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(new Date(s.startTime) > now ? { hour: 'numeric', minute: '2-digit' } : {}),
      }),
      title: s.title,
      status: s.status === 'completed' ? 'completed' : new Date(s.startTime) > now ? 'upcoming' : 'cancelled',
    }));

    const lastCompleted = sessions
      .filter((s: any) => s.status === 'completed')
      .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

    return res.json({
      id: String(mentorship._id),
      name: mentorship.menteeName,
      email: mentorship.menteeEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mentorship.menteeName || 'Mentee')}`,
      goal: mentorship.goal || 'Career development',
      progress: plan.progress || 0,
      lastSession: lastCompleted ? new Date(lastCompleted.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never',
      nextSession: nextSession ? new Date(nextSession.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : undefined,
      status,
      studentId: mentorship.menteeClerkId,
      milestones,
      sessions: sessionList,
      notes: plan.notes || undefined,
    });
  } catch (error) {
    console.error('Error fetching mentee details:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// PATCH /api/mentor-mentees/:id/plan (update notes/progress)
router.patch('/mentor-mentees/:id/plan', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    const { notes, progress } = req.body as { notes?: string; progress?: number };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mentee id' });

    const mentorship = await Mentorship.findOne({ _id: id, mentorId });
    if (!mentorship) return res.status(404).json({ message: 'Mentee not found' });

    const plan = await MenteePlan.findOneAndUpdate(
      { mentorId, mentorshipId: id },
      {
        $set: {
          ...(typeof notes === 'string' ? { notes } : {}),
          ...(typeof progress === 'number' ? { progress } : {}),
        },
      },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: { notes: plan.notes, progress: plan.progress } });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-mentees/:id/milestones (add milestone)
router.post('/mentor-mentees/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    const { title, description, dueDate } = req.body as { title?: string; description?: string; dueDate?: string };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mentee id' });
    if (!title || !description) return res.status(400).json({ message: 'title and description are required' });

    const mentorship = await Mentorship.findOne({ _id: id, mentorId });
    if (!mentorship) return res.status(404).json({ message: 'Mentee not found' });

    const plan = await getOrCreatePlanByMentorship(mentorId, new mongoose.Types.ObjectId(id));
    plan.milestones.push({ title, description, completed: false, ...(dueDate ? { dueDate: new Date(dueDate) } : {}) } as any);
    await plan.save();

    const last = plan.milestones[plan.milestones.length - 1] as any;
    return res.status(201).json({ success: true, data: { id: String(last._id), title: last.title, description: last.description, completed: !!last.completed, dueDate: last.dueDate } });
  } catch (error) {
    console.error('Error adding milestone:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// PATCH /api/mentor-mentees/:id/milestones/:milestoneId
router.patch('/mentor-mentees/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    const { title, description, dueDate, completed } = req.body as { title?: string; description?: string; dueDate?: string; completed?: boolean };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const plan = await getOrCreatePlanByMentorship(mentorId, new mongoose.Types.ObjectId(id));
    const milestone = (plan.milestones as any).id(milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    if (typeof title === 'string') milestone.title = title;
    if (typeof description === 'string') milestone.description = description;
    if (typeof completed === 'boolean') milestone.completed = completed;
    if (typeof dueDate === 'string') milestone.dueDate = new Date(dueDate);

    await plan.save();
    return res.json({ success: true, data: { id: String(milestone._id), title: milestone.title, description: milestone.description, completed: !!milestone.completed, dueDate: milestone.dueDate } });
  } catch (error) {
    console.error('Error updating milestone:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// DELETE /api/mentor-mentees/:id/milestones/:milestoneId
router.delete('/mentor-mentees/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const plan = await getOrCreatePlanByMentorship(mentorId, new mongoose.Types.ObjectId(id));
    const milestone = (plan.milestones as any).id(milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    milestone.deleteOne();
    await plan.save();
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-mentees/:id/message
router.post('/mentor-mentees/:id/message', async (req, res) => {
  try {
    const { id } = req.params; // mentorshipId
    const { mentorId, message } = req.body as { mentorId?: string; message?: string };
    if (!mentorId) return res.status(400).json({ message: 'mentorId is required' });
    if (!message || !message.trim()) return res.status(400).json({ message: 'message is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mentee id' });

    const mentorship = await Mentorship.findOne({ _id: id, mentorId });
    if (!mentorship) return res.status(404).json({ message: 'Mentee not found' });

    const doc = await MenteeMessage.create({ mentorId, mentorshipId: id, sender: 'mentor', message: message.trim() });
    return res.json({ success: true, data: { id: String(doc._id), createdAt: doc.createdAt } });
  } catch (error) {
    console.error('Error sending mentee message:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
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
      orderId,
      razorpaySignature,
      mentorEmail,
      mentorName,
    } = req.body;

    // Enhanced logging for debugging
    console.log('[confirm-payment] Received request:', {
      mentorId,
      studentId,
      studentName,
      title,
      orderId,
      paymentId,
      hasSignature: !!razorpaySignature
    });

    if (!mentorId || !studentName || !title || !startTime || !endTime || !paymentId || !orderId || !razorpaySignature) {
      console.error('[confirm-payment] Missing required fields:', {
        mentorId: !!mentorId,
        studentName: !!studentName,
        title: !!title,
        startTime: !!startTime,
        endTime: !!endTime,
        paymentId: !!paymentId,
        orderId: !!orderId,
        razorpaySignature: !!razorpaySignature
      });
      return res.status(400).json({
        message: 'mentorId, studentName, title, startTime, endTime, orderId, paymentId, and razorpaySignature are required.',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[confirm-payment] RAZORPAY_KEY_SECRET is missing from environment');
      return res.status(500).json({ message: 'Razorpay secret is not configured on the server.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      console.error('[confirm-payment] Invalid dates:', { startTime, endTime });
      return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
    }

    // Verify signature from Razorpay
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('[confirm-payment] Signature mismatch:', { expectedSignature, razorpaySignature });
      return res.status(400).json({ message: 'Payment signature verification failed.' });
    }

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    const sessionId = `session-${Date.now()}`;
    const meetingLink = `https://meet.jit.si/aureeture-${sessionId}`;
    const mentorIdStr = String(mentorId);
    const agoraChannel = `session-${Date.now()}-${mentorIdStr.slice(-8)}`;

    console.log('[confirm-payment] Creating MentorSession...');
    const session = await MentorSession.create({
      mentorId,
      studentId,
      menteeId: studentId,
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
      orderId,
      razorpaySignature,
      rescheduleCount: 0,
      rescheduleRequests: [],
    });

    console.log('[confirm-payment] Session created:', session._id);

    // Handle mentorship upsert to track the mentee
    try {
      await upsertMentorshipFromSession(mentorId, studentId, studentEmail, studentName, title);
    } catch (mentorshipErr) {
      console.error('[confirm-payment] Mentorship upsert failed (non-blocking):', mentorshipErr);
    }

    // Email notifications (non-blocking)
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
      sendEmail({
        to: studentEmail,
        subject: studentEmailContent.subject,
        html: studentEmailContent.html,
      }).catch((err) => {
        console.error('Failed to send student confirmation email:', err);
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
      sendEmail({
        to: mentorEmail,
        subject: mentorEmailContent.subject,
        html: mentorEmailContent.html,
      }).catch((err) => {
        console.error('Failed to send mentor confirmation email:', err);
      });
    }

    return res.status(201).json({
      session,
      message: 'Session confirmed, signature verified, and notifications sent',
    });
  } catch (error: any) {
    console.error('Error confirming payment and creating session:', error);
    return res.status(500).json({ 
      message: 'An error occurred while confirming your session. Please contact support.',
      error: error.message 
    });
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