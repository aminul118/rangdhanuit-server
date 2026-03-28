import { Types } from 'mongoose';

export interface IMessage {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt?: string;
}
