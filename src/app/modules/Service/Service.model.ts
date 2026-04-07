import generateSlug from '../../utils/generateSlug';
import { Schema, model } from 'mongoose';
import { IService, ServiceModel } from './Service.interface';

const serviceSchema = new Schema<IService, ServiceModel>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    icon: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

serviceSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

generateSlug<IService>(serviceSchema, 'title', 'slug');

export const Service = model<IService, ServiceModel>('Service', serviceSchema);
