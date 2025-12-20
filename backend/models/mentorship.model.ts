import mongoose, { Schema, Document, Model } from 'mongoose';

export type MentorshipStatus = 'invited' | 'active' | 'paused' | 'ended';

/**
 * Mentorship is the source-of-truth mapping between a mentor and a mentee.
 *
 * The frontend uses Clerk userIds (strings), so this schema stores:
 * - mentorId: Clerk userId of the mentor
 * - menteeClerkId: Clerk userId of the mentee (null until they register)
 * - menteeEmail: used to "claim" invites on registration
 */
export interface IMentorship extends Document {
  mentorId: string;
  menteeClerkId?: string;
  menteeEmail: string;
  menteeName: string;
  goal?: string;
  status: MentorshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipSchema = new Schema<IMentorship>(
  {
    mentorId: { type: String, required: true, index: true },
    menteeClerkId: { type: String, index: true },
    menteeEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    menteeName: { type: String, required: true, trim: true },
    goal: { type: String, default: '' },
    status: {
      type: String,
      enum: ['invited', 'active', 'paused', 'ended'],
      default: 'invited',
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate mentor->email mentorship rows
MentorshipSchema.index({ mentorId: 1, menteeEmail: 1 }, { unique: true });

export const Mentorship: Model<IMentorship> =
  mongoose.models.Mentorship || mongoose.model<IMentorship>('Mentorship', MentorshipSchema);

export default Mentorship;
