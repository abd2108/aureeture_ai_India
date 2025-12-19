import { Schema, model, Document, Types } from 'mongoose';

export interface IConnection extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  message: String
}, { timestamps: true });

// Compound index to prevent duplicate connection requests
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default model<IConnection>('Connection', ConnectionSchema);



