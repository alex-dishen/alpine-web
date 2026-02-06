import type { ColumnDef } from '@tanstack/react-table';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
import { COLUMN_TYPES } from '@/configs/api/types/api.enums';
import { TextCell } from '@/pages/jobs/features/jobs-table/ui/text-cell';
import { DateCell } from '@/pages/jobs/features/jobs-table/ui/date-cell';
import { UrlCell } from '@/pages/jobs/features/jobs-table/ui/url-cell';
import { CheckboxCell } from '@/pages/jobs/features/jobs-table/ui/checkbox-cell';
import { SelectCell } from '@/pages/jobs/features/jobs-table/ui/select-cell';
import { MultiSelectCell } from '@/pages/jobs/features/jobs-table/ui/multi-select-cell';
import { ColumnHeader } from '../ui/column-header';
import {
  formatColumnValue,
  getIconForColumnType,
} from './jobs-table-columns.helper';
import type {
  CreateColumnOptions,
  CreateColumnsOptions,
} from './jobs-table-columns.factory.types';

const createColumn = ({
  column,
  getValue,
  onChange,
  columnHeaderCallbacks,
}: CreateColumnOptions): ColumnDef<JobApplicationWithStage> => {
  const icon = getIconForColumnType(column.column_type);

  const baseColumn: Partial<ColumnDef<JobApplicationWithStage>> = {
    id: column.id,
    accessorKey: column.field_key ?? undefined,
    size: 150,
    meta: {
      column,
      icon,
      callbacks: columnHeaderCallbacks,
    },
  };

  // Simple header - DraggableHeader will wrap with dropdown
  const renderHeader = () => <ColumnHeader icon={icon} name={column.name} />;

  switch (column.column_type) {
    case COLUMN_TYPES.TEXT:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => (
          <TextCell
            value={(getValue(row.original) as string) ?? ''}
            onChange={(value) => onChange(row.original.id, value)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.NUMBER:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => {
          const value = getValue(row.original);

          return (
            <TextCell
              value={value != null ? String(value) : ''}
              onChange={(v) => onChange(row.original.id, v ? Number(v) : null)}
            />
          );
        },
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.DATE:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => (
          <DateCell
            value={(getValue(row.original) as string) ?? null}
            onChange={(value) => onChange(row.original.id, value)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.URL:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => (
          <UrlCell
            value={(getValue(row.original) as string) ?? null}
            onChange={(value) => onChange(row.original.id, value)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.CHECKBOX:
      return {
        ...baseColumn,
        header: renderHeader,
        size: 80,
        cell: ({ row }) => (
          <CheckboxCell
            value={Boolean(getValue(row.original))}
            onChange={(value) => onChange(row.original.id, value)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.SELECT:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => (
          <SelectCell
            value={(getValue(row.original) as string) ?? null}
            options={
              column.options?.map((opt) => ({
                id: opt.id,
                value: opt.label,
                color: opt.color ?? undefined,
              })) ?? []
            }
            onChange={(value) => onChange(row.original.id, value)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case COLUMN_TYPES.MULTI_SELECT:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: ({ row }) => (
          <MultiSelectCell
            values={(getValue(row.original) as string[]) ?? []}
            options={
              column.options?.map((opt) => ({
                id: opt.id,
                value: opt.label,
                color: opt.color ?? undefined,
              })) ?? []
            }
            onChange={(values) => onChange(row.original.id, values)}
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    default:
      return {
        ...baseColumn,
        header: renderHeader,
        cell: () => <span className="text-muted-foreground">-</span>,
      } as ColumnDef<JobApplicationWithStage>;
  }
};

export const createJobColumns = ({
  columns,
  onUpdateJob,
  onUpdateColumnValue,
  columnHeaderCallbacks,
}: CreateColumnsOptions): ColumnDef<JobApplicationWithStage>[] => {
  const tableColumns: ColumnDef<JobApplicationWithStage>[] = columns.map(
    (col) => {
      // Working with core columns that weren't created by user
      if (col.is_core && col.field_key) {
        const fieldKey = col.field_key as keyof JobApplicationWithStage;

        return createColumn({
          column: col,
          getValue: (row) => row[fieldKey],
          onChange: (jobId, value) => onUpdateJob(jobId, col.field_key!, value),
          columnHeaderCallbacks,
        });
      }

      // Working with columns created by user
      return createColumn({
        column: col,
        getValue: () => null, // Custom columns get values from column_values (not yet loaded)
        onChange: (jobId, value) =>
          onUpdateColumnValue(jobId, col.id, formatColumnValue(col, value)),
        columnHeaderCallbacks,
      });
    }
  );

  return tableColumns;
};
