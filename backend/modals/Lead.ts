// backend/src/models/Lead.ts
import { Schema, model, Document } from 'mongoose';

// Define the structure of a Lead document for TypeScript
export interface ILead extends Document {
  name: string;
  email: string;
  mobile: string;
  page?: string;
  utm?: object;
  source: string;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  page: { type: String, trim: true }, // The page the form was on
  utm: { type: Object }, // Stores marketing tags like utm_source
  source: { type: String, default: 'website-modal' },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Create the model from the schema
const Lead = model<ILead>('Lead', LeadSchema);

export default Lead;


