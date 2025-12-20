import { Schema, model, Document } from 'mongoose';

export interface IMentorAvailability extends Document {
  mentorId: string; // Clerk userId
  timezone: string;
  weeklySlots: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // "HH:mm" format
    endTime: string; // "HH:mm" format
    isActive: boolean;
  }>;
  overrideSlots: Array<{
    date: Date; // Specific date
    startTime: string;
    endTime: string;
    isBlocked: boolean; // true = blocked, false = available
  }>;
  instantBookingEnabled: boolean;
  minNoticeHours: number; // Minimum hours before a session can be booked
  maxSessionsPerWeek: number;
  createdAt: Date;
  updatedAt: Date;
}

const MentorAvailabilitySchema = new Schema<IMentorAvailability>(
  {
    mentorId: { type: String, required: true, unique: true, index: true },
    timezone: { type: String, required: true, default: 'Asia/Kolkata' },
    weeklySlots: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      isActive: { type: Boolean, default: true },
    }],
    overrideSlots: [{
      date: { type: Date, required: true },
      startTime: { type: String },
      endTime: { type: String },
      isBlocked: { type: Boolean, default: false },
    }],
    instantBookingEnabled: { type: Boolean, default: true },
    minNoticeHours: { type: Number, default: 2 },
    maxSessionsPerWeek: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default model<IMentorAvailability>('MentorAvailability', MentorAvailabilitySchema);







