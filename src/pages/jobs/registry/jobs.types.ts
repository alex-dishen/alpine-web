import { z } from 'zod';
import type { components } from '@/configs/api/types/api.generated';

// Re-export generated types with convenient names
export type JobApplicationWithStage =
  components['schemas']['JobApplicationWithStageResponseDto'];
export type JobColumn =
  components['schemas']['JobColumnWithOptionsResponseDto'];
export type JobInterview = components['schemas']['JobInterviewResponseDto'];

// Zod schemas for form validation
export const createJobSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  stage_id: z.string().uuid('Stage is required'),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  job_description: z.string().optional(),
  notes: z.string().optional(),
  applied_at: z.string().optional(),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createInterviewSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  scheduled_at: z.string().min(1, 'Date is required'),
  duration_mins: z.number().optional(),
  location: z.string().optional(),
  meeting_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  notes: z.string().optional(),
  outcome: z.enum(['pending', 'passed', 'failed', 'canceled']).optional(),
});

export type CreateInterviewFormData = z.infer<typeof createInterviewSchema>;
