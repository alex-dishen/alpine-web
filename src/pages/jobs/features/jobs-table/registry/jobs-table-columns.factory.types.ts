import type {
  JobApplicationWithStage,
  JobColumn,
} from '@/pages/jobs/registry/jobs.types';

export type ColumnHeaderCallbacks = {
  onSort: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter: (columnId: string) => void;
  onRenameColumn: (columnId: string, newName: string) => void;
  onDeleteColumn: (columnId: string) => void;
  getHasActiveSort: (columnId: string) => boolean;
  getHasActiveFilter: (columnId: string) => boolean;
};

export type CreateColumnsOptions = {
  columns: JobColumn[];
  onUpdateJob: (id: string, field: string, value: unknown) => void;
  onUpdateColumnValue: (
    jobId: string,
    columnId: string,
    value: Record<string, unknown>
  ) => void;
  columnHeaderCallbacks?: ColumnHeaderCallbacks;
};

export type CreateColumnOptions = {
  column: JobColumn;
  getValue: (row: JobApplicationWithStage) => unknown;
  onChange: (jobId: string, value: unknown) => void;
  columnHeaderCallbacks?: ColumnHeaderCallbacks;
};
