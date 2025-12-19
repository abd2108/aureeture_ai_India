import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  careerStage?: string;
  longTermGoal?: string;
  currentRole?: string;
  currentCompany?: string;
  joinDate?: string;
  personalInfo: {
    phone?: string;
    linkedIn?: string;
    location?: string;
  };
  workHistory: { company: string; role: string; from: Date; to?: Date; description?: string }[];
  education: { institution: string; degree: string; from: Date; to?: Date }[];
  projects: { name: string; description: string; link?: string }[];
  skills: string[];
  tasks?: {
    todo: Array<{ id: number; title: string; priority: 'high' | 'medium' | 'low'; deadline?: Date }>;
    later: Array<{ id: number; title: string; priority: 'high' | 'medium' | 'low'; deadline?: Date }>;
    done: Array<{ id: number; title: string; priority: 'high' | 'medium' | 'low'; deadline?: Date }>;
  };
  careerGoals?: Array<{ name: string; progress: number }>;
  analytics?: {
    profileCompletion: number;
    skillScore: number;
    views: number;
    connects: number;
    applications: number;
    matches: number;
  };
  preferences: {
    location: string[];
    workModel: 'Remote' | 'Hybrid' | 'On-site';
    salaryRange: { min: number; max: number };
    openToInternships: boolean;
  };
  onboardingComplete: boolean;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  careerStage: String,
  longTermGoal: String,
  currentRole: String,
  currentCompany: String,
  joinDate: String,
  personalInfo: {
    phone: String,
    linkedIn: String,
    location: String,
  },
  workHistory: [{ company: String, role: String, from: Date, to: Date, description: String }],
  education: [{ institution: String, degree: String, from: Date, to: Date }],
  projects: [{ name: String, description: String, link: String }],
  skills: [String],
  tasks: {
    todo: [{
      id: Number,
      title: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] },
      deadline: Date,
    }],
    later: [{
      id: Number,
      title: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] },
      deadline: Date,
    }],
    done: [{
      id: Number,
      title: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] },
      deadline: Date,
    }],
  },
  careerGoals: [{
    name: String,
    progress: Number,
  }],
  analytics: {
    profileCompletion: { type: Number, default: 0 },
    skillScore: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    connects: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
  },
  preferences: {
    location: [String],
    workModel: { type: String, enum: ['Remote', 'Hybrid', 'On-site'] },
    salaryRange: { min: Number, max: Number },
    openToInternships: Boolean,
  },
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IProfile>('Profile', ProfileSchema);


