import mongoose, { Schema, Document, Model } from 'mongoose';

export type MessageSender = 'mentor' | 'mentee' | 'system';

export interface IMenteeMessage extends Document {
  mentorId: string; // Clerk user id of mentor
  // NEW: stable mapping (preferred)
  mentorshipId?: mongoose.Types.ObjectId;
  // LEGACY: MentorSession "draft" record that represented the relationship
  sessionId?: mongoose.Types.ObjectId;
  sender: MessageSender;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenteeMessageSchema = new Schema<IMenteeMessage>(
  {
    mentorId: { type: String, required: true, index: true },
    mentorshipId: { type: Schema.Types.ObjectId, ref: 'Mentorship', index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'MentorSession', index: true },
    sender: { type: String, enum: ['mentor', 'mentee', 'system'], default: 'mentor' },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Common query: all messages for a mentor+mentee (mentorship)
MenteeMessageSchema.index({ mentorId: 1, mentorshipId: 1, createdAt: -1 });
MenteeMessageSchema.index({ mentorId: 1, sessionId: 1, createdAt: -1 });

// At least one linkage must exist
MenteeMessageSchema.pre('validate', function (next) {
  // @ts-ignore
  if (!this.mentorshipId && !this.sessionId) {
    // @ts-ignore
    this.invalidate('mentorshipId', 'Either mentorshipId or sessionId is required.');
  }
  next();
});

export const MenteeMessage: Model<IMenteeMessage> =
  mongoose.models.MenteeMessage || mongoose.model<IMenteeMessage>('MenteeMessage', MenteeMessageSchema);

export default MenteeMessage;
