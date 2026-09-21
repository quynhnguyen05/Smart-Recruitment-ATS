import { z } from 'zod';

export const matchOutputSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  confidence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export type MatchOutput = z.infer<typeof matchOutputSchema>;