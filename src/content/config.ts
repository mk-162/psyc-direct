import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    coverImage: image().optional(),
    publishDate: z.coerce.date(),
    author: z.string(),
    category: z.string(),
    excerpt: z.string().nullable().optional(),
    seoTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts,
};
