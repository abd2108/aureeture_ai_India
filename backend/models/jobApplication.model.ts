import { Schema, model, Document, Types } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Accepted';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted'], default: 'Applied' },
  coverLetter: String,
  resumeUrl: String,
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default model<IJobApplication>('JobApplication', JobApplicationSchema);



