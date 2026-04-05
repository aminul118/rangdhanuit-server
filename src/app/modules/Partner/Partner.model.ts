import { Schema, model } from 'mongoose';
import { IPartner } from './Partner.interface';

const partnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String, required: false },
    link: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


export const Partner = model<IPartner>('Partner', partnerSchema);
