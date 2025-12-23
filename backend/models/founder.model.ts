import { Schema, model, Document, Types } from "mongoose";

export interface IFounder extends Document {
  userId: Types.ObjectId;
  role: "founder";
  name?: string;
  email?: string;
  linkedinUrl?: string;
  companyName?: string;
  headline?: string;
  ideaDescription?: string;
  stage?: string; // idea, mvp, traction, scaling
  needs?: string[]; // hiring, fundraising, cofounder, mentorship, etc.
  website?: string;
  location?: string;
}

const FounderSchema = new Schema<IFounder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    role: { type: String, enum: ["founder"], default: "founder" },
    name: String,
    email: String,
    linkedinUrl: String,
    companyName: String,
    headline: String,
    ideaDescription: String,
    stage: String,
    needs: { type: [String], default: [] },
    website: String,
    location: String,
  },
  { timestamps: true }
);

FounderSchema.index({ userId: 1 }, { unique: true });

export default model<IFounder>("Founder", FounderSchema);

