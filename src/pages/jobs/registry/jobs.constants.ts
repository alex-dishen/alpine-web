import type { JobColumnType } from './jobs.types';

// Note: Stages are now fully managed by the API, no frontend defaults needed

// System columns configuration (for UI display purposes)
// The API manages custom columns only - system columns (company, job_title, etc.)
// are built into JobApplication and handled separately in the UI
export const SYSTEM_COLUMN_NAMES = [
  'Company',
  'Position',
  'Stage',
  'Applied',
  'URL',
  'Salary',
  'Location',
] as const;

// Column type labels for UI (using lowercase snake_case from API)
export const COLUMN_TYPE_LABELS: Record<JobColumnType, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  url: 'URL',
  checkbox: 'Checkbox',
  select: 'Single Select',
  multi_select: 'Multi Select',
};

// Stage color presets
export const STAGE_COLOR_PRESETS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#9CA3AF', // Gray-400
];

// Interview outcome labels (API uses outcome instead of type/status)
export const INTERVIEW_OUTCOME_LABELS: Record<string, string> = {
  pending: 'Pending',
  passed: 'Passed',
  failed: 'Failed',
  canceled: 'Canceled',
};
