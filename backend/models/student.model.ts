import { Schema, model, Document, Types } from "mongoose";

export interface IStudentEducation {
  school: string;
  degree: string;
  major: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

export interface IStudentExperience {
  company: string;
  role: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IStudentProject {
  name: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface IStudentLinks {
  portfolio?: string;
  github?: string;
  leetcode?: string;
  codechef?: string;
  other?: string;
}

export interface IWorkingDay {
  id: string;
  label: string;
  short: string;
  available: boolean;
  start: string;
  end: string;
}

export interface IStudentPreferences {
  domains?: string[];
  workModel?: string;
  salaryRange?: { min?: number; max?: number; currency?: string };
  openToInternships?: boolean;
  openToRelocation?: boolean;
}

export interface IStudent extends Document {
  userId: Types.ObjectId;
  role: "student";
  fullName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  resumeFile?: string;
  educations: IStudentEducation[];
  experiences: IStudentExperience[];
  projects: IStudentProject[];
  awards?: string;
  links: IStudentLinks;
  skills: string[];
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
    workAuthorization?: string;
    willingToRelocate?: boolean;
  };
  availability?: {
    workingDays: IWorkingDay[];
  };
  preferences?: IStudentPreferences;
}

const EducationSchema = new Schema<IStudentEducation>(
  {
    school: String,
    degree: String,
    major: String,
    startYear: String,
    endYear: String,
    gpa: String,
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IStudentExperience>(
  {
    company: String,
    role: String,
    city: String,
    country: String,
    startDate: String,
    endDate: String,
    description: String,
  },
  { _id: false }
);

const ProjectSchema = new Schema<IStudentProject>(
  {
    name: String,
    startYear: String,
    endYear: String,
    description: String,
  },
  { _id: false }
);

const WorkingDaySchema = new Schema<IWorkingDay>(
  {
    id: String,
    label: String,
    short: String,
    available: Boolean,
    start: String,
    end: String,
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    role: { type: String, enum: ["student"], default: "student" },
    fullName: String,
    email: String,
    phone: String,
    linkedinUrl: String,
    resumeFile: String,
    educations: { type: [EducationSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    awards: String,
    links: {
      portfolio: String,
      github: String,
      leetcode: String,
      codechef: String,
      other: String,
    },
    skills: { type: [String], default: [] },
    location: {
      city: String,
      country: String,
      timezone: String,
      workAuthorization: String,
      willingToRelocate: Boolean,
    },
    availability: {
      workingDays: { type: [WorkingDaySchema], default: [] },
    },
    preferences: {
      domains: { type: [String], default: [] },
      workModel: String,
      salaryRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: "INR" },
      },
      openToInternships: Boolean,
      openToRelocation: Boolean,
    },
  },
  { timestamps: true }
);

StudentSchema.index({ userId: 1 }, { unique: true });

export default model<IStudent>("Student", StudentSchema);

