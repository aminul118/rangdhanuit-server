import { Model } from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactModel = Model<IContact, Record<string, never>>;
