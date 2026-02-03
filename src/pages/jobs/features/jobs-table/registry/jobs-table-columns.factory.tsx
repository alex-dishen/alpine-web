import type { ColumnDef } from '@tanstack/react-table';
import {
  Hash,
  Link,
  List,
  AlignLeft,
  CheckSquare,
  CalendarIcon,
  CircleChevronDown,
} from 'lucide-react';
import type { JobApplicationWithStage, JobColumn } from '@/pages/jobs/registry/jobs.types';
import { TextCell } from '@/pages/jobs/features/jobs-table/ui/text-cell';
import { DateCell } from '@/pages/jobs/features/jobs-table/ui/date-cell';
import { UrlCell } from '@/pages/jobs/features/jobs-table/ui/url-cell';
import { CheckboxCell } from '@/pages/jobs/features/jobs-table/ui/checkbox-cell';
import { SelectCell } from '@/pages/jobs/features/jobs-table/ui/select-cell';
import { MultiSelectCell } from '@/pages/jobs/features/jobs-table/ui/multi-select-cell';
import { ColumnHeader } from '../ui/column-header';
import { formatColumnValue, getColumnSize } from './jobs-table-columns.helper';
import type {
  CreateColumnOptions,
  CreateColumnsOptions,
  ColumnHeaderCallbacks,
} from './jobs-table-columns.factory.types';

export type ColumnMeta = {
  column: JobColumn;
  icon: React.ComponentType<{ className?: string }>;
  callbacks?: ColumnHeaderCallbacks;
};

export const getIconForColumnType = (columnType: string) => {
  switch (columnType) {
    case 'text':
      return AlignLeft;
    case 'number':
      return Hash;
    case 'date':
      return CalendarIcon;
    case 'url':
      return Link;
    case 'checkbox':
      return CheckSquare;
    case 'select':
      return CircleChevronDown;
    case 'multi_select':
      return List;
    default:
      return AlignLeft;
  }
};

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
    size: getColumnSize(column.field_key),
    meta: {
      column,
      icon,
      callbacks: columnHeaderCallbacks,
    } as ColumnMeta,
  };

  // Simple header - DraggableHeader will wrap with dropdown
  const renderHeader = () => <ColumnHeader icon={icon} name={column.name} />;

  switch (column.column_type) {
    case 'text':
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

    case 'number':
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

    case 'date':
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

    case 'url':
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

    case 'checkbox':
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

    case 'select':
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

    case 'multi_select':
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
