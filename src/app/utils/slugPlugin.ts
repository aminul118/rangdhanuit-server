/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateSlug } from './slugify';

interface SlugPluginOptions {
  sourceField?: string;
}

/**
 * A Mongoose plugin to automatically generate and update slugs.
 */
export const slugPlugin = (schema: any, options: SlugPluginOptions = {}) => {
  const sourceField = options.sourceField || 'title';

  // Add slug field to schema if not present
  if (!schema.path('slug')) {
    schema.add({
      slug: {
        type: String,
        unique: true,
        index: true,
      },
    });
  }

  // Pre-save hook
  schema.pre('save', function (this: any, next: any) {
    // Determine the source field
    const effectiveSourceField = this[sourceField] ? sourceField : (this.name ? 'name' : sourceField);

    if (this.isModified(effectiveSourceField) || this.isNew) {
      if (this[effectiveSourceField]) {
        this.slug = generateSlug(this[effectiveSourceField]);
      }
    }
    next();
  });


  // Pre-findOneAndUpdate hook
  schema.pre('findOneAndUpdate', function (this: any, next: any) {
    const update = this.getUpdate() as any;
    
    // Check both title and name for updates
    if (update && (update[sourceField] || update.name)) {
      const textToSlugify = update[sourceField] || update.name;
      if (typeof textToSlugify === 'string') {
        update.slug = generateSlug(textToSlugify);
      }
    }
    next();
  });
};
