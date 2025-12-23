import { Schema, model, Document, Types } from "mongoose";

export interface IMentorWeeklySlot {
  id: string;
  day: string; // e.g. "Monday"
  startTime: string; // "18:00"
  endTime: string; // "21:00"
}

export interface IMentorOverrideSlot {
  id: string;
  date: string; // ISO yyyy-mm-dd
  startTime: string;
  endTime: string;
}

export interface IMentorPricing {
  expectedHourlyRate: number | null;
  expectedHalfHourRate: number | null;
  currency: string;
}

export interface IMentor extends Document {
  userId: Types.ObjectId;
  role: "mentor";
  name: string;
  currentRole: string;
  company: string;
  linkedinUrl: string;
  resumeUrl?: string;
  totalExperienceYears: number | null;
  educationDegree: string;
  educationCollege: string;
  specializationTags: string[];
  pricing: IMentorPricing;
  timezone: string;
  weeklyAvailability: IMentorWeeklySlot[];
  overrideAvailability: IMentorOverrideSlot[];
  /**
   * Indicates the mentor has completed the onboarding wizard and unlocked the dashboard.
   */
  isOnboarded: boolean;
  onboardedAt?: Date;
  bio?: string;
  location?: string;
  mentoringFocus?: string;
  idealMentee?: string;
  languages?: string;
  minNoticeHours?: number | null;
  maxSessionsPerWeek?: number | null;
  preSessionNotesRequired?: boolean;
  allowRecording?: boolean;
  isVerified: boolean;
  isOnline: boolean;
  avatarUrl?: string;
}

const WeeklySlotSchema = new Schema<IMentorWeeklySlot>(
  {
    id: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const OverrideSlotSchema = new Schema<IMentorOverrideSlot>(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const MentorSchema = new Schema<IMentor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    role: { type: String, enum: ["mentor"], default: "mentor" },
    name: { type: String, required: true },
    currentRole: { type: String, required: true },
    company: { type: String, default: "" },
    linkedinUrl: { type: String, required: true },
    resumeUrl: { type: String },
    totalExperienceYears: { type: Number },
    educationDegree: { type: String, default: "" },
    educationCollege: { type: String, default: "" },
    specializationTags: { type: [String], default: [] },
    pricing: {
      expectedHourlyRate: { type: Number, default: null },
      expectedHalfHourRate: { type: Number, default: null },
      currency: { type: String, default: "INR" },
    },
    timezone: { type: String, default: "Asia/Kolkata" },
    weeklyAvailability: { type: [WeeklySlotSchema], default: [] },
    overrideAvailability: { type: [OverrideSlotSchema], default: [] },
    isOnboarded: { type: Boolean, default: false, index: true },
    onboardedAt: { type: Date },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    mentoringFocus: { type: String, default: "" },
    idealMentee: { type: String, default: "" },
    languages: { type: String, default: "" },
    minNoticeHours: { type: Number, default: null },
    maxSessionsPerWeek: { type: Number, default: null },
    preSessionNotesRequired: { type: Boolean, default: false },
    allowRecording: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

MentorSchema.index({ userId: 1 }, { unique: true });

export default model<IMentor>("Mentor", MentorSchema);

