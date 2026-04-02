import { Schema, model } from 'mongoose';
import { IContact, ContactModel } from './Contact.interface';

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Contact = model<IContact, ContactModel>('Contact', contactSchema);
