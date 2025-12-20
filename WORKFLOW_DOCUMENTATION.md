# Aureeture Platform: Updated Booking Workflow Documentation

## Overview

This document describes the updated "Instant Commitment" booking workflow for the Aureeture ed-tech platform, where paid bookings are automatically confirmed without requiring mentor approval.

---

## 1. Core Workflow Change: "Instant Commitment" Model

### 1.1 Key Principles

- **Paid Bookings = Instant Confirmation**: Once a mentee books and pays, the session is automatically confirmed
- **No Accept/Decline for Paid Bookings**: Mentors cannot decline paid bookings
- **Reschedule Instead of Cancel**: Mentors can only "Request Reschedule" (not cancel)
- **Reschedule Tracking**: System tracks reschedule frequency and warns mentors after 2+ reschedules

### 1.2 Flow Diagram

```
Student selects mentor
    ↓
Student clicks "Book Now"
    ↓
Slot Selection Layer (NEW)
    ↓
Student selects available time slot
    ↓
Payment Gateway
    ↓
Payment Successful
    ↓
AUTOMATIC CONFIRMATION:
  - Session created in database
  - Email sent to mentor & student
  - In-app notification triggered
  - Dashboard updated instantly
  - Calendly event created (if configured)
  - Meeting link generated
    ↓
Session appears in both dashboards
```

---

## 2. Student Dashboard: Availability Layer

### 2.1 Slot Selection Component

**Location**: `/dashboard/student/booking/slot-selection`

**Features**:
- Calendar/list view of mentor's available time slots
- Week navigation (Previous/Next week)
- Real-time availability checking
- Slot selection with visual feedback
- Integration with mentor's weekly schedule and overrides

**User Flow**:
1. Student clicks "Book Now" on mentor card
2. Redirected to slot selection page
3. Views available slots for the current week
4. Selects preferred time slot
5. Clicks "Proceed to Payment"
6. Redirected to payment page with selected slot details

**API Endpoint**: `GET /api/mentor-availability/slots`

---

## 3. Post-Payment Automation

### 3.1 Triggers

Immediately after successful payment:

1. **Session Creation**
   - Session record created in database
   - Status: `scheduled`
   - Payment status: `paid`
   - Booking type: `paid`

2. **Email Notifications**
   - Confirmation email to student
   - Notification email to mentor
   - Both emails include:
     - Session details (title, date, time)
     - Meeting link
     - Calendar invite (if Calendly integrated)

3. **In-App Notifications**
   - Push notification/bell icon alert for mentor
   - Push notification/bell icon alert for student
   - Real-time dashboard updates

4. **Dashboard Updates**
   - Session appears in "Upcoming Sessions" on mentor overview
   - Session appears in "Upcoming Sessions" on student overview
   - Both dashboards update without page refresh

**API Endpoint**: `POST /api/mentor-sessions/confirm-payment`

---

## 4. Calendly API Integration

### 4.1 Integration Strategy

**Service**: `backend/src/services/calendly.service.ts`

**Features**:
- Create Calendly events automatically after payment
- Generate meeting links (Google Meet/Zoom) via Calendly API
- Sync event URIs back to database
- Fallback to Jitsi Meet if Calendly fails

**Flow**:
1. Payment confirmed
2. Call `createCalendlyEvent()` with session details
3. Calendly API creates event and returns:
   - Event URI
   - Invitee URI
   - Meeting link
4. Store URIs in session record
5. Use meeting link for "Join Call" button

**Environment Variable**: `CALENDLY_API_KEY`

**Fallback**: If Calendly fails, system generates Jitsi Meet link automatically

---

## 5. Mentor Dashboard Changes

### 5.1 Removed Features

- ❌ "Accept" button for paid bookings
- ❌ "Decline" button for paid bookings
- ❌ "Cancel Session" button

### 5.2 New Features

- ✅ "Request Reschedule" button (replaces Cancel)
- ✅ Reschedule request modal with:
  - Reason field (required)
  - Preferred new time (optional)
  - Warning if reschedule count ≥ 2
- ✅ Reschedule tracking:
  - Count stored in `rescheduleCount`
  - History in `rescheduleRequests[]`
  - Warning message: "Frequent rescheduling negatively impacts your Mentor Profile Rating"

### 5.3 Pending Requests Section

**Updated Behavior**:
- Paid bookings no longer appear as "pending"
- They appear as "Auto-confirmed after payment"
- Only free/unpaid requests would show (if any)

---

## 6. Technical Architecture

### 6.1 Database Models

#### MentorSession Model
```typescript
{
  mentorId: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  title: string;
  startTime: Date;
  endTime: Date;
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

#### MentorAvailability Model
```typescript
{
  mentorId: string;
  timezone: string;
  weeklySlots: Array<{
    day: 'Monday' | 'Tuesday' | ...;
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

### 6.2 API Endpoints

#### GET `/api/mentor-availability/slots`
- Query params: `mentorId`, `startDate`, `endDate`
- Returns: Array of available time slots

#### POST `/api/mentor-sessions/confirm-payment`
- Body: Session details, payment info
- Creates session, sends emails, triggers notifications
- Returns: Created session object

#### POST `/api/mentor-sessions/:id/reschedule`
- Query params: `mentorId`
- Body: `rescheduleRequest` object
- Updates session status, increments reschedule count
- Returns: Updated session

### 6.3 Services

#### Email Service (`backend/src/services/email.service.ts`)
- `sendEmail()`: Send email via Resend/SendGrid
- `generateSessionConfirmationEmail()`: Generate HTML email template

#### Calendly Service (`backend/src/services/calendly.service.ts`)
- `createCalendlyEvent()`: Create event via Calendly API
- `syncCalendlyToDatabase()`: Store event URIs in database
- Fallback to Jitsi Meet if Calendly fails

---

## 7. User Stories

### 7.1 Student Booking Flow

**As a student**, I want to:
1. Browse available mentors
2. Click "Book Now" on a mentor
3. See their available time slots
4. Select a preferred slot
5. Pay for the session
6. Receive instant confirmation
7. See the session in my dashboard immediately
8. Get email confirmation with meeting link

### 7.2 Mentor Experience

**As a mentor**, I want to:
1. See paid bookings auto-confirmed (no action needed)
2. Request reschedule if needed (with reason)
3. Get warned if I reschedule too frequently
4. Receive email notification when session is booked
5. See session in my dashboard instantly
6. Have meeting link ready for "Join Call" button

---

## 8. Implementation Checklist

### Backend
- [x] Update MentorSession model with new fields
- [x] Create MentorAvailability model
- [x] Create email service
- [x] Create Calendly service
- [x] Add availability slots endpoint
- [x] Add post-payment confirmation endpoint
- [x] Add reschedule request endpoint
- [ ] Integrate actual email provider (Resend/SendGrid)
- [ ] Integrate actual Calendly API
- [ ] Add WebSocket for real-time notifications

### Frontend
- [x] Remove Accept/Decline from mentor overview
- [x] Replace Cancel with Request Reschedule
- [x] Add reschedule modal with warnings
- [x] Create slot selection page
- [x] Update booking flow to include slot selection
- [x] Update payment page to trigger post-payment automation
- [ ] Add real-time notification bell
- [ ] Add notification toast system
- [ ] Update student overview to show new sessions

### Testing
- [ ] Test slot selection flow
- [ ] Test payment → confirmation flow
- [ ] Test email delivery
- [ ] Test reschedule request flow
- [ ] Test reschedule warning (2+ times)
- [ ] Test Calendly integration
- [ ] Test fallback to Jitsi Meet

---

## 9. Future Enhancements

1. **Real-time Notifications**
   - WebSocket integration for instant updates
   - Push notifications for mobile apps

2. **Calendar Sync**
   - Google Calendar integration
   - Outlook Calendar integration
   - iCal export

3. **Advanced Reschedule Flow**
   - Student can approve/reject reschedule requests
   - Automatic reschedule if both parties agree
   - Reschedule history in session details

4. **Availability Management**
   - Recurring slot templates
   - Bulk availability updates
   - Timezone-aware scheduling

5. **Analytics**
   - Reschedule rate tracking
   - Mentor reliability score
   - Booking conversion metrics

---

## 10. Environment Variables

```env
# Calendly Integration
CALENDLY_API_KEY=your_calendly_api_key

# Email Service (Resend example)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@aureeture.ai

# Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
```

---

## 11. Error Handling

### Payment Success, Session Creation Fails
- Log error
- Show user-friendly message
- Provide support contact
- Queue retry mechanism

### Calendly Integration Fails
- Fallback to Jitsi Meet
- Log error for monitoring
- Continue with session creation

### Email Delivery Fails
- Log error
- Continue with session creation
- Queue email retry
- Show warning in dashboard

---

## 12. Security Considerations

1. **Payment Verification**
   - Verify Razorpay webhook signature
   - Validate payment amount matches session price
   - Prevent duplicate session creation

2. **Reschedule Limits**
   - Enforce maximum reschedule count
   - Rate limit reschedule requests
   - Track abuse patterns

3. **Availability Access**
   - Verify mentor owns availability slots
   - Prevent slot manipulation
   - Validate time slot conflicts

---

## Conclusion

This updated workflow provides a seamless, automated booking experience that reduces friction for both mentors and students while maintaining flexibility through the reschedule mechanism. The system is designed to scale and integrate with external services (Calendly, email providers) while maintaining fallback options for reliability.







