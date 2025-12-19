export type MentorSpecializationTag = string;

export interface MentorPricingPreferences {
  expectedHourlyRate: number | null;
  expectedHalfHourRate: number | null;
  currency: string; // e.g. "INR"
}

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface MentorWeeklySlot {
  id: string;
  day: Weekday;
  startTime: string; // "18:00"
  endTime: string; // "21:00"
}

export interface MentorOverrideSlot {
  id: string;
  date: string; // ISO yyyy-mm-dd
  startTime: string;
  endTime: string;
}

export interface MentorProfile {
  id?: string;
  name: string;
  currentRole: string;
  company: string;
  linkedinUrl: string;
  resumeUrl?: string;

  totalExperienceYears: number | null;
  educationDegree: string;
  educationCollege: string;
  specializationTags: MentorSpecializationTag[];

  pricing: MentorPricingPreferences;

  timezone: string;
  weeklyAvailability: MentorWeeklySlot[];
  overrideAvailability: MentorOverrideSlot[];

  isVerified: boolean;
  isOnline: boolean;

  createdAt?: string;
  updatedAt?: string;
}




