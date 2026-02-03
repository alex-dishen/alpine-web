import { z } from 'zod';
import type { components } from '@/configs/api/types/api.generated';

// Re-export generated types with convenient names
export type JobStage = components['schemas']['JobStageResponseDto'];
export type JobStageWithCount =
  components['schemas']['JobStageWithCountResponseDto'];
export type JobApplicationWithStage =
  components['schemas']['JobApplicationWithStageResponseDto'];
export type JobApplicationWithDetails =
  components['schemas']['JobApplicationWithDetailsResponseDto'];
export type JobColumn =
  components['schemas']['JobColumnWithOptionsResponseDto'];
export type JobColumnOption =
  components['schemas']['JobColumnOptionResponseDto'];
export type JobColumnValue =
  components['schemas']['JobColumnValueWithOptionResponseDto'];
export type JobInterview = components['schemas']['JobInterviewResponseDto'];
export type InterviewWithJob =
  components['schemas']['InterviewWithJobResponseDto'];
export type CursorPagination = components['schemas']['CursorPaginationDto'];
export type JobCountResponse = components['schemas']['JobCountResponseDto'];

// Enum types extracted from generated schemas
export type JobStageCategory =
  components['schemas']['JobStageResponseDto']['category'];
export type JobColumnType =
  components['schemas']['JobColumnWithOptionsResponseDto']['column_type'];
export type InterviewOutcome =
  components['schemas']['JobInterviewResponseDto']['outcome'];

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

export const updateJobSchema = createJobSchema.partial();

export type UpdateJobFormData = z.infer<typeof updateJobSchema>;

export const createStageSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  color: z.string().optional(),
  category: z.enum(['initial', 'interview', 'positive', 'negative']),
  position: z.number(),
});

export type CreateStageFormData = z.infer<typeof createStageSchema>;

export const createColumnSchema = z.object({
  name: z.string().min(1, 'Column name is required'),
  column_type: z.enum([
    'text',
    'number',
    'date',
    'url',
    'checkbox',
    'select',
    'multi_select',
  ]),
});

export type CreateColumnFormData = z.infer<typeof createColumnSchema>;

export const createInterviewSchema = z.object({
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
