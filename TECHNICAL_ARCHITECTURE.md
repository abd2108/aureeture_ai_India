# Aureeture Platform: Technical Architecture & Code Snippets

## Overview

This document provides technical implementation details and code snippets for the updated "Instant Commitment" booking workflow.

---

## 1. Database Schema Updates

### 1.1 MentorSession Model

**File**: `backend/src/models/mentorSession.model.ts`

```typescript
export interface IMentorSession extends Document {
  mentorId: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'reschedule_requested';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingType: 'paid' | 'free';
  meetingLink?: string;
  rescheduleCount: number;
  rescheduleRequests: Array<{
    requestedAt: Date;
    requestedBy: 'mentor' | 'student';
    reason?: string;
    newStartTime?: Date;
    newEndTime?: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  amount?: number;
  paymentId?: string;
}
```

### 1.2 MentorAvailability Model

**File**: `backend/src/models/mentorAvailability.model.ts`

```typescript
export interface IMentorAvailability extends Document {
  mentorId: string;
  timezone: string;
  weeklySlots: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // "HH:mm"
    endTime: string;
    isActive: boolean;
  }>;
  overrideSlots: Array<{
    date: Date;
    startTime?: string;
    endTime?: string;
    isBlocked: boolean;
  }>;
  instantBookingEnabled: boolean;
  minNoticeHours: number;
  maxSessionsPerWeek: number;
}
```

---

## 2. API Endpoints

### 2.1 Get Available Slots

**Endpoint**: `GET /api/mentor-availability/slots`

**Query Parameters**:
- `mentorId` (required)
- `startDate` (optional, ISO string)
- `endDate` (optional, ISO string)

**Response**:
```json
{
  "slots": [
    {
      "id": "slot-1234567890-10",
      "startTime": "2025-01-15T10:00:00.000Z",
      "endTime": "2025-01-15T11:00:00.000Z",
      "isAvailable": true,
      "isBooked": false
    }
  ]
}
```

**Implementation** (`backend/src/server.ts`):
```typescript
app.get('/api/mentor-availability/slots', async (req, res) => {
  // Fetches mentor availability
  // Generates slots from weekly schedule
  // Checks for conflicts with existing sessions
  // Returns available slots
});
```

### 2.2 Post-Payment Confirmation

**Endpoint**: `POST /api/mentor-sessions/confirm-payment`

**Request Body**:
```json
{
  "mentorId": "user_abc123",
  "studentId": "user_xyz789",
  "studentName": "John Doe",
  "studentEmail": "john@example.com",
  "title": "System Design Interview Prep",
  "description": "Mock interview session",
  "startTime": "2025-01-15T10:00:00.000Z",
  "endTime": "2025-01-15T11:00:00.000Z",
  "amount": 5000,
  "paymentId": "pay_razorpay123",
  "mentorEmail": "mentor@example.com",
  "mentorName": "Jane Smith"
}
```

**Response**:
```json
{
  "session": { /* session object */ },
  "message": "Session confirmed and notifications sent"
}
```

**Implementation Flow**:
1. Create session record with `status: 'scheduled'`, `paymentStatus: 'paid'`
2. Generate meeting link (Calendly or Jitsi fallback)
3. Send confirmation emails to both parties
4. Trigger in-app notifications
5. Return created session

### 2.3 Request Reschedule

**Endpoint**: `POST /api/mentor-sessions/:id/reschedule`

**Query Parameters**:
- `mentorId` (required)

**Request Body**:
```json
{
  "rescheduleRequest": {
    "requestedBy": "mentor",
    "reason": "Unexpected conflict",
    "newStartTime": "2025-01-16T14:00:00.000Z",
    "newEndTime": "2025-01-16T15:00:00.000Z"
  }
}
```

**Response**: Updated session object

**Implementation**:
- Increments `rescheduleCount`
- Adds entry to `rescheduleRequests[]`
- Sets `status: 'reschedule_requested'`
- Returns updated session

---

## 3. Frontend Components

### 3.1 Slot Selection Page

**File**: `frontend/app/dashboard/student/booking/slot-selection/page.tsx`

**Key Features**:
- Week navigation (Previous/Next)
- Grouped slots by date
- Visual selection feedback
- Proceeds to payment with selected slot

**Key Code Snippet**:
```typescript
const handleProceedToPayment = () => {
  if (!selectedSlot) return;
  
  const params = new URLSearchParams({
    ...Object.fromEntries(searchParams.entries()),
    selectedSlotId: selectedSlot.id,
    selectedStartTime: selectedSlot.startTime.toISOString(),
    selectedEndTime: selectedSlot.endTime.toISOString(),
  });
  
  router.push(`/dashboard/payment?${params.toString()}`);
};
```

### 3.2 Mentor Sessions - Reschedule Modal

**File**: `frontend/app/dashboard/mentor/sessions/page.tsx`

**Key Features**:
- Warning if reschedule count ≥ 2
- Required reason field
- Optional new time suggestion
- Calls reschedule API endpoint

**Key Code Snippet**:
```typescript
const handleRequestReschedule = async () => {
  const rescheduleCount = (selectedSession as any).rescheduleCount || 0;
  
  if (rescheduleCount >= 2) {
    const confirmed = window.confirm(
      "⚠️ Warning: You've already rescheduled this session multiple times. " +
      "Frequent rescheduling negatively impacts your Mentor Profile Rating..."
    );
    if (!confirmed) return;
  }
  
  // Make API call to request reschedule
  await fetch(`${apiBase}/api/mentor-sessions/${selectedSession._id}/reschedule`, {
    method: "POST",
    body: JSON.stringify({
      rescheduleRequest: {
        requestedBy: "mentor",
        reason: rescheduleReason,
        newStartTime: newRescheduleTime,
      },
    }),
  });
};
```

### 3.3 Payment Page - Post-Payment Automation

**File**: `frontend/app/dashboard/payment/page.tsx`

**Key Code Snippet**:
```typescript
handler: async function (response: any) {
  // Payment successful - trigger post-payment automation
  const confirmRes = await fetch(`${apiBase}/api/mentor-sessions/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({
      mentorId: searchParams.get("mentorId"),
      studentName: searchParams.get("studentName"),
      startTime: searchParams.get("selectedStartTime"),
      endTime: searchParams.get("selectedEndTime"),
      amount: price,
      paymentId: response.razorpay_payment_id,
      // ... other fields
    }),
  });
  
  if (confirmRes.ok) {
    // Redirect to dashboard
    window.location.href = "/dashboard/student/overview";
  }
}
```

---

## 4. Service Layer

### 4.1 Email Service

**File**: `backend/src/services/email.service.ts`

**Key Functions**:
- `sendEmail()`: Generic email sender
- `generateSessionConfirmationEmail()`: Generates HTML email template

**Usage**:
```typescript
const emailContent = generateSessionConfirmationEmail(
  recipientName,
  sessionTitle,
  mentorName,
  startTime,
  endTime,
  meetingLink,
  isMentor
);

await sendEmail({
  to: recipientEmail,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### 4.2 Calendly Service

**File**: `backend/src/services/calendly.service.ts`

**Key Functions**:
- `createCalendlyEvent()`: Creates event via Calendly API
- `syncCalendlyToDatabase()`: Stores event URIs

**Usage**:
```typescript
const result = await createCalendlyEvent({
  mentorCalendlyUri: mentor.calendlyUri,
  studentEmail: studentEmail,
  studentName: studentName,
  startTime: startTime,
  endTime: endTime,
  title: sessionTitle,
});

// result contains: { eventUri, inviteeUri, meetingLink }
```

**Fallback**:
If Calendly fails, automatically generates Jitsi Meet link:
```typescript
const roomName = `aureeture-${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-')}`;
return `https://meet.jit.si/${roomName}`;
```

---

## 5. State Management

### 5.1 Session Status Flow

```
Payment Success
    ↓
status: 'scheduled'
paymentStatus: 'paid'
bookingType: 'paid'
    ↓
[If mentor requests reschedule]
    ↓
status: 'reschedule_requested'
rescheduleCount: +1
rescheduleRequests: [...previous, newRequest]
    ↓
[If student approves]
    ↓
status: 'scheduled'
startTime: newStartTime
endTime: newEndTime
```

### 5.2 Reschedule Warning Logic

```typescript
// In frontend component
const rescheduleCount = session.rescheduleCount || 0;

if (rescheduleCount >= 2) {
  // Show warning modal
  // Impact: "Negatively affects Mentor Profile Rating"
  // User must confirm to proceed
}
```

---

## 6. Integration Points

### 6.1 Razorpay Payment Gateway

**Integration Flow**:
1. Create Razorpay order via `/api/razorpay/order`
2. Open Razorpay checkout
3. On success, call `/api/mentor-sessions/confirm-payment`
4. Redirect to dashboard

### 6.2 Calendly API

**Required Setup**:
1. Get Calendly API key from mentor's account
2. Store in `CALENDLY_API_KEY` environment variable
3. Get mentor's Calendly user URI
4. Create event type mapping

**API Call Example**:
```typescript
const response = await fetch('https://api.calendly.com/scheduled_events', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${CALENDLY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event_type: eventTypeUri,
    invitee: { email, name },
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
  }),
});
```

### 6.3 Email Provider (Resend Example)

**Setup**:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@aureeture.ai
```

**Implementation**:
```typescript
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Aureeture <noreply@aureeture.ai>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  }),
});
```

---

## 7. Error Handling Patterns

### 7.1 Payment Success, Session Creation Fails

```typescript
try {
  await confirmPayment();
} catch (error) {
  // Log error
  console.error('Session creation failed:', error);
  
  // Show user-friendly message
  setStatusMessage(
    "Payment successful, but session confirmation failed. " +
    "Please contact support with payment ID: " + paymentId
  );
  
  // Queue retry mechanism
  await queueRetry(paymentId, sessionData);
}
```

### 7.2 Calendly Integration Fails

```typescript
let meetingLink = '';
try {
  const calendlyResult = await createCalendlyEvent(params);
  meetingLink = calendlyResult.meetingLink;
} catch (error) {
  console.warn('Calendly failed, using fallback:', error);
  // Fallback to Jitsi Meet
  meetingLink = generateJitsiMeetLink(sessionId, studentName);
}
```

### 7.3 Email Delivery Fails

```typescript
try {
  await sendEmail(emailOptions);
} catch (error) {
  console.error('Email delivery failed:', error);
  // Continue with session creation
  // Queue email for retry
  await queueEmailRetry(emailOptions);
}
```

---

## 8. Testing Checklist

### 8.1 Unit Tests

- [ ] Slot generation from weekly schedule
- [ ] Reschedule count increment
- [ ] Email template generation
- [ ] Calendly event creation
- [ ] Jitsi fallback generation

### 8.2 Integration Tests

- [ ] Complete booking flow (slot selection → payment → confirmation)
- [ ] Email delivery
- [ ] Calendly integration
- [ ] Reschedule request flow
- [ ] Reschedule warning (2+ times)

### 8.3 E2E Tests

- [ ] Student books session end-to-end
- [ ] Mentor receives notification
- [ ] Mentor requests reschedule
- [ ] Warning appears on 3rd reschedule
- [ ] Session appears in both dashboards

---

## 9. Performance Considerations

### 9.1 Slot Generation

- Cache mentor availability for 5 minutes
- Use database indexes on `mentorId` and `startTime`
- Batch slot generation for multiple mentors

### 9.2 Email Delivery

- Queue emails asynchronously
- Use email service webhooks for delivery status
- Retry failed emails with exponential backoff

### 9.3 Real-time Updates

- Use WebSocket for instant dashboard updates
- Implement optimistic UI updates
- Fallback to polling if WebSocket unavailable

---

## 10. Security Best Practices

### 10.1 Payment Verification

```typescript
// Verify Razorpay webhook signature
const crypto = require('crypto');
const signature = crypto
  .createHmac('sha256', RAZORPAY_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== req.headers['x-razorpay-signature']) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 10.2 Reschedule Rate Limiting

```typescript
// Prevent abuse
const recentReschedules = await MentorSession.countDocuments({
  mentorId,
  rescheduleRequests: {
    $elemMatch: {
      requestedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  },
});

if (recentReschedules > 5) {
  return res.status(429).json({ error: 'Too many reschedule requests' });
}
```

### 10.3 Slot Conflict Prevention

```typescript
// Check for overlapping sessions
const conflict = await MentorSession.findOne({
  mentorId,
  startTime: { $lt: newEndTime },
  endTime: { $gt: newStartTime },
  status: { $in: ['scheduled', 'ongoing'] },
});

if (conflict) {
  return res.status(409).json({ error: 'Time slot conflict' });
}
```

---

## Conclusion

This technical architecture provides a robust, scalable foundation for the "Instant Commitment" booking workflow. The system is designed with fallbacks, error handling, and security considerations to ensure reliability and user trust.







