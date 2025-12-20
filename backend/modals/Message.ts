// backend/src/models/Message.ts
import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

const Message = model<IMessage>('Message', MessageSchema);

export default Message;


