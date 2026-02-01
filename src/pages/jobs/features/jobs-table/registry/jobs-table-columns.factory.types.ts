import type {
  JobApplicationWithStage,
  JobColumn,
} from '@/pages/jobs/registry/jobs.types';

export type CreateColumnsOptions = {
  columns: JobColumn[];
  onUpdateJob: (id: string, field: string, value: unknown) => void;
  onUpdateColumnValue: (
    jobId: string,
    columnId: string,
    value: Record<string, unknown>
  ) => void;
  onDeleteJob: (id: string) => void;
  onOpenDetail: (id: string) => void;
};

export type CreateColumnOptions = {
  column: JobColumn;
  getValue: (row: JobApplicationWithStage) => unknown;
  onChange: (jobId: string, value: unknown) => void;
};
