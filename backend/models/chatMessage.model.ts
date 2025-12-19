import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  message: string;
  sender: 'user' | 'caro';
  timestamp: Date;
  sessionId: string;
  context?: {
    careerGoal?: string;
    currentFocus?: string;
    relatedJobs?: Types.ObjectId[];
  };
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'caro'], required: true },
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: String, required: true },
  context: {
    careerGoal: String,
    currentFocus: String,
    relatedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
  }
}, { timestamps: true });

export default model<IChatMessage>('ChatMessage', ChatMessageSchema);



