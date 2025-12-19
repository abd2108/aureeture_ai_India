import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: string; // Clerk user ID
  email: string;
  name: string;
  education?: {
    college?: string;
    degree?: string;
    graduationYear?: string;
  };
  skills?: string[];
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema<IProfile>({
  userId: { type: String, required: true, index: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  education: {
    college: { type: String },
    degree: { type: String },
    graduationYear: { type: String },
  },
  skills: [{ type: String }],
  interests: [{ type: String }],
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;



