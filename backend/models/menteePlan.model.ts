import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenteeMilestone {
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface IMenteePlan extends Document {
  mentorId: string; // Clerk user id of mentor
  // NEW: Stable mentorship mapping (preferred)
  mentorshipId?: mongoose.Types.ObjectId;
  // LEGACY: The "draft" MentorSession used as the mentee record
  sessionId?: mongoose.Types.ObjectId;
  progress: number;
  milestones: IMenteeMilestone[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMenteeMilestone>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
  },
  { _id: true }
);

const MenteePlanSchema = new Schema<IMenteePlan>(
  {
    mentorId: { type: String, required: true, index: true },
    mentorshipId: { type: Schema.Types.ObjectId, ref: 'Mentorship', unique: true, sparse: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'MentorSession', unique: true, sparse: true, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: { type: [MilestoneSchema], default: [] },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// At least one linkage must exist
MenteePlanSchema.pre('validate', function (next) {
  // @ts-ignore
  if (!this.mentorshipId && !this.sessionId) {
    // @ts-ignore
    this.invalidate('mentorshipId', 'Either mentorshipId or sessionId is required.');
  }
  next();
});

export const MenteePlan: Model<IMenteePlan> =
  mongoose.models.MenteePlan || mongoose.model<IMenteePlan>('MenteePlan', MenteePlanSchema);

export default MenteePlan;
