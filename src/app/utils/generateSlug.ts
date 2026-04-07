/* eslint-disable @typescript-eslint/no-explicit-any */
import { slugify } from 'transliteration';
import { Schema } from 'mongoose';

/**
 * Adds automatic slug generation middleware to any schema
 * @param schema Mongoose schema
 * @param field The field from which the slug will be generated (default: "title")
 * @param slugField The field where slug will be stored (default: "slug")
 */

function generateSlug<T>(
  schema: Schema<any, any>,
  field: keyof T = 'title' as keyof T,
  slugField: keyof T = 'slug' as keyof T,
) {
  schema.pre('save', function (next) {
    const doc = this as any;
    if (doc.isModified(field as string)) {
      doc.set(slugField as string, slugify(doc.get(field as string)));
    }
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as any;
    if (update && update[field as string]) {
      update[slugField as string] = slugify(update[field as string]);
      this.setUpdate(update);
    }
    next();
  });

  schema.pre('updateOne', function (next) {
    const update = this.getUpdate() as any;
    if (update && update[field as string]) {
      update[slugField as string] = slugify(update[field as string]);
      this.setUpdate(update);
    }
    next();
  });
}

export default generateSlug;
