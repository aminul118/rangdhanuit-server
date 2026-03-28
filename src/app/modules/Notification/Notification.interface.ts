import { Types } from 'mongoose';

export interface INotification {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'MESSAGE' | 'SYSTEM' | 'ALERT';
  content: string;
  isRead: boolean;
  isDeleted: boolean;
}
