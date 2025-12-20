import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IEnterpriseDemo extends Document {
  name: string;
  email: string;
  company: string;
  page?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnterpriseDemoSchema = new Schema<IEnterpriseDemo>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    page: { type: String, default: '' },
  },
  { timestamps: true }
);

const EnterpriseDemo =
  (models.EnterpriseDemo as mongoose.Model<IEnterpriseDemo>) ||
  model<IEnterpriseDemo>('EnterpriseDemo', EnterpriseDemoSchema);

export default EnterpriseDemo;


