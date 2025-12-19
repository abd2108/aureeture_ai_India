import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  workModel: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: { min: number; max: number };
  description: string;
  requirements: string[];
  skills: string[];
  experience: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedBy: Types.ObjectId;
  postedAt: Date;
  expiresAt: Date;
  applications: Types.ObjectId[];
  isActive: boolean;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  workModel: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], required: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  experience: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  applications: [{ type: Schema.Types.ObjectId, ref: 'JobApplication' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IJob>('Job', JobSchema);



