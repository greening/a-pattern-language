import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: rule => rule.required(),
      options: { source: 'name' },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'page',
      title: 'Page(s) in book',
      type: 'string',
    }),
    defineField({
      name: 'sidebarSection',
      title: 'Sidebar Menu Section (optional)',
      type: 'reference',
      to: [{ type: 'section' }],
    }),
    defineField({
      name: 'sections',
      title: 'Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pageSection' }] }],
    }),
  ],
});
