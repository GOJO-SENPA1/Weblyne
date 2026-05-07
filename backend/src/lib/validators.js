import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(120),
  email: z.string().trim().email('Invalid email').max(200),
  phone: z.string().trim().min(5).max(40).optional().or(z.literal('').transform(() => undefined)),
  service: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  budget: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  // accept either `desc` (frontend form field) or `description` (api standard)
  description: z.string().trim().min(10, 'Tell us a bit more about your project').max(4000).optional(),
  desc: z.string().trim().min(10).max(4000).optional(),
  // Honeypot fields — accepted from any client, route checks them and silently drops spam.
  website: z.string().max(500).optional(),
  hp_token: z.string().max(500).optional(),
}).refine(d => d.description || d.desc, { message: 'description is required', path: ['description'] })
  .transform(d => ({ ...d, description: d.description || d.desc }));

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(200),
});

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().min(1).max(40),
  client_name: z.string().trim().max(120).optional(),
  tech_stack: z.array(z.string().trim().max(40)).default([]),
  image_url: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
  live_url: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
  challenge: z.string().trim().max(4000).optional(),
  approach: z.string().trim().max(4000).optional(),
  results: z.string().trim().max(4000).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const blogSchema = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase-dashed slug'),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().trim().min(10),
  category: z.string().trim().max(40).optional(),
  author: z.string().trim().max(120).optional(),
  read_time: z.string().trim().max(20).optional(),
  image_url: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
  published: z.boolean().optional(),
  published_at: z.string().datetime().optional(),
});

export const contactPatchSchema = z.object({
  status: z.enum(['new', 'replied', 'archived']).optional(),
});
