import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

export const formatColumnValue = (
  column: JobColumn,
  value: unknown
): Record<string, unknown> => {
  switch (column.column_type) {
    case 'select':
      return { option_id: value };
    case 'multi_select':
      return { option_ids: value };
    case 'checkbox':
      return { text_value: value ? 'true' : 'false' };
    default:
      return { text_value: value };
  }
};

export const getColumnSize = (fieldKey: string | null | undefined): number => {
  switch (fieldKey) {
    case 'company_name':
    case 'job_title':
      return 200;
    case 'applied_at':
    case 'stage_id':
      return 150;
    case 'salary_min':
    case 'salary_max':
      return 120;
    default:
      return 150;
  }
};
