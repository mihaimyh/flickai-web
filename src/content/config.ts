import {defineCollection, z} from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    lang: z.enum(['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh']),
    publishDate: z.coerce.date(),
    ogImage: z.string().optional(),
  }),
});

const alternatives = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    lang: z.enum(['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh']),
    publishDate: z.coerce.date(),
    ogImage: z.string().optional(),
  }),
});

const useCases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    lang: z.enum(['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh']),
    publishDate: z.coerce.date(),
    ogImage: z.string().optional(),
  }),
});

export const collections = {
  guides,
  alternatives,
  useCases,
};
