import type { ColumnDef } from '@tanstack/react-table';
import {
  Hash,
  Link,
  List,
  Trash2,
  AlignLeft,
  CheckSquare,
  ExternalLink,
  CalendarIcon,
  MoreHorizontal,
  CircleChevronDown,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
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
} from './jobs-table-columns.factory.types';

const createColumn = ({
  column,
  getValue,
  onChange,
}: CreateColumnOptions): ColumnDef<JobApplicationWithStage> => {
  const baseColumn: Partial<ColumnDef<JobApplicationWithStage>> = {
    id: column.id,
    accessorKey: column.field_key ?? undefined,
    size: getColumnSize(column.field_key),
  };

  switch (column.column_type) {
    case 'text':
      return {
        ...baseColumn,
        header: () => <ColumnHeader icon={AlignLeft} name={column.name} />,
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
        header: () => <ColumnHeader icon={Hash} name={column.name} />,
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
        header: () => <ColumnHeader icon={CalendarIcon} name={column.name} />,
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
        header: () => <ColumnHeader icon={Link} name={column.name} />,
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
        header: () => <ColumnHeader icon={CheckSquare} name={column.name} />,
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
        header: () => (
          <ColumnHeader icon={CircleChevronDown} name={column.name} />
        ),
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
        header: () => <ColumnHeader icon={List} name={column.name} />,
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
        header: () => <ColumnHeader icon={AlignLeft} name={column.name} />,
        cell: () => <span className="text-muted-foreground">-</span>,
      } as ColumnDef<JobApplicationWithStage>;
  }
};

export const createJobColumns = ({
  columns,
  onUpdateJob,
  onUpdateColumnValue,
  onDeleteJob,
  onOpenDetail,
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
        });
      }

      // Working with columns created by user
      return createColumn({
        column: col,
        getValue: () => null, // Custom columns get values from column_values (not yet loaded)
        onChange: (jobId, value) =>
          onUpdateColumnValue(jobId, col.id, formatColumnValue(col, value)),
      });
    }
  );

  // Actions column (always last)
  tableColumns.push({
    id: 'actions',
    header: '',
    size: 50,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpenDetail(row.original.id)}>
            <ExternalLink className="mr-2 size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDeleteJob(row.original.id)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  return tableColumns;
};
