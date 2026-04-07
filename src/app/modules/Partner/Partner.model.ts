import { Schema, model } from 'mongoose';
import { IPartner } from './Partner.interface';
import generateSlug from '../../utils/generateSlug';

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

generateSlug<IPartner>(partnerSchema, 'name', 'slug');

export const Partner = model<IPartner>('Partner', partnerSchema);
