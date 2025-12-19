import { Schema, model, Document } from 'mongoose';

export type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'reschedule_requested';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type BookingType = 'paid' | 'free' | 'manual';


export interface IMentorSession extends Document {
  mentorId: string; // Clerk userId for the mentor
  studentId?: string; // Clerk userId for the student
  studentName: string;
  studentEmail?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  startedAt?: Date; // When session actually started (mentor joined)
  endedAt?: Date; // When session actually ended
  durationMinutes: number;
  status: SessionStatus;
  paymentStatus: PaymentStatus;
  bookingType: BookingType;
  meetingLink?: string;
  agoraChannel?: string; // Agora channel name for video sessions
  recordingUrl?: string;
  notes?: string;
  // Reschedule tracking
  rescheduleCount: number;
  rescheduleRequests: Array<{
    requestedAt: Date;
    requestedBy: 'mentor' | 'student';
    reason?: string;
    newStartTime?: Date;
    newEndTime?: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  // Calendly integration
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  // Payment details
  amount?: number;
  currency?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorSessionSchema = new Schema<IMentorSession>(
  {
    mentorId: { type: String, required: true, index: true },
    studentId: { type: String, index: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    durationMinutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft','scheduled', 'ongoing', 'completed', 'cancelled', 'reschedule_requested'],
      default: 'scheduled',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
      index: true,
    },
    bookingType: {
  type: String,
  enum: ['paid', 'free', 'manual'],
  default: 'paid',
},

    meetingLink: { type: String },
    agoraChannel: { type: String, index: true },
    recordingUrl: { type: String },
    notes: { type: String },
    rescheduleCount: { type: Number, default: 0 },
    rescheduleRequests: [{
      requestedAt: { type: Date, default: Date.now },
      requestedBy: { type: String, enum: ['mentor', 'student'] },
      reason: { type: String },
      newStartTime: { type: Date },
      newEndTime: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    }],
    calendlyEventUri: { type: String },
    calendlyInviteeUri: { type: String },
    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export default model<IMentorSession>('MentorSession', MentorSessionSchema);









