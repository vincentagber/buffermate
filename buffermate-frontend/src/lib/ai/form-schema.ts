import { z } from 'zod';

/**
 * Zod Schema for Structured Form Extraction
 * Validates social media posts, task creation, and scheduling forms.
 */
export const FormExtractionSchema = z.object({
  title: z
    .string()
    .describe('Catchy headline, task title, or brief summary of the post'),
  content: z
    .string()
    .describe(
      'Polished, high-converting social media post text or task description, with clean line breaks, emojis, and persuasive hooks'
    ),
  platforms: z
    .array(z.string())
    .default(['x'])
    .describe('Target social channels (e.g. x, twitter, linkedin, facebook, instagram, tiktok, threads)'),
  scheduledAt: z
    .string()
    .describe(
      'Calculated ISO-8601 date-time string (e.g. 2026-10-13T15:00:00) calculated from relative user instructions like "tomorrow at 3pm"'
    ),
  scheduledAtDisplay: z
    .string()
    .optional()
    .describe('Human readable timing representation e.g. "Tomorrow at 3:00 PM WAT"'),
  tone: z
    .enum([
      'professional',
      'casual',
      'witty',
      'urgent',
      'empathetic',
      'promotional',
      'thought-leadership',
      'neutral',
    ])
    .default('professional')
    .describe('The detected tone of voice'),
  mode: z
    .enum(['text', 'video'])
    .default('text')
    .describe('Content format: "video" if the user mentions reel, tiktok, video, or script; otherwise "text"'),
  videoTopic: z
    .string()
    .optional()
    .describe('Video concept, script prompt, or hook if mode is video'),
  hashtags: z
    .array(z.string())
    .default([])
    .describe('Relevant hashtags extracted or generated for reach'),
  suggestedMediaPrompt: z
    .string()
    .optional()
    .describe('Visual image or photography generation prompt matching the post message'),
  category: z
    .string()
    .optional()
    .describe('Category of the post/task (e.g. Product Update, Marketing, Engineering, Community)'),
  callToAction: z
    .string()
    .optional()
    .describe('Specific call to action e.g. "Check the link below", "Comment your thoughts"'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .default(0.95)
    .describe('Extraction confidence score between 0 and 1'),
});

export type ExtractedFormData = z.infer<typeof FormExtractionSchema>;
