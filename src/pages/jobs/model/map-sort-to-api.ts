import type { Sort } from '@/configs/zustand/jobs-table/jobs-table.helpers';
import type { components } from '@/configs/api/types/api.generated';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type SortByEnum = components['schemas']['JobSortDto']['sort_by'];
type ApiSort = {
  sort_by: SortByEnum;
  order: 'asc' | 'desc';
  column_id?: string;
};

const CORE_SORT_FIELDS: Set<string> = new Set([
  'stage',
  'category',
  'is_archived',
  'company_name',
  'job_title',
  'applied_at',
  'salary_min',
  'salary_max',
  'created_at',
]);

export const mapSortToApi = (
  sort: Sort | null,
  columns: JobColumn[]
): ApiSort | undefined => {
  if (!sort) return undefined;

  const column = columns.find((c) => c.id === sort.columnId);

  if (!column) return undefined;

  if (column.is_core) {
    if (column.field_key && CORE_SORT_FIELDS.has(column.field_key)) {
      return {
        sort_by: column.field_key as SortByEnum,
        order: sort.direction,
      };
    }

    return undefined;
  }

  return {
    sort_by: 'custom_column' as SortByEnum,
    order: sort.direction,
    column_id: column.id,
  };
};
