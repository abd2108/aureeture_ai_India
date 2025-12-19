import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  company: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  technologies: string[];
  requirements: string[];
  deliverables: string[];
  mentorId?: Types.ObjectId;
  participants: Types.ObjectId[];
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  isActive: boolean;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: String, required: true },
  technologies: [String],
  requirements: [String],
  deliverables: [String],
  mentorId: { type: Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed', 'Cancelled'], default: 'Open' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IProject>('Project', ProjectSchema);



