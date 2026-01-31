import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import type {
  JobApplicationWithStage,
  JobColumn,
  JobStage,
} from '@/pages/jobs/registry/jobs.types';
import { TextCell } from '@/pages/jobs/features/jobs-table/ui/text-cell';
import { DateCell } from '@/pages/jobs/features/jobs-table/ui/date-cell';
import { UrlCell } from '@/pages/jobs/features/jobs-table/ui/url-cell';
import { StageCell } from '@/pages/jobs/features/jobs-table/ui/stage-cell';
import { CheckboxCell } from '@/pages/jobs/features/jobs-table/ui/checkbox-cell';
import { SelectCell } from '@/pages/jobs/features/jobs-table/ui/select-cell';
import { MultiSelectCell } from '@/pages/jobs/features/jobs-table/ui/multi-select-cell';

type CreateColumnsOptions = {
  columns: JobColumn[];
  stages: JobStage[];
  onUpdateJob: (id: string, field: string, value: unknown) => void;
  onUpdateColumnValue: (
    jobId: string,
    columnId: string,
    value: Record<string, unknown>
  ) => void;
  onDeleteJob: (id: string) => void;
  onOpenDetail: (id: string) => void;
};

export const createJobColumns = ({
  columns,
  stages,
  onUpdateJob,
  onUpdateColumnValue,
  onDeleteJob,
  onOpenDetail,
}: CreateColumnsOptions): ColumnDef<JobApplicationWithStage>[] => {
  const tableColumns: ColumnDef<JobApplicationWithStage>[] = [];

  // System columns (built into JobApplication, not from columns API)
  // Company column
  tableColumns.push({
    id: 'company',
    accessorKey: 'company_name',
    header: 'Company',
    size: 200,
    cell: ({ row }) => (
      <TextCell
        value={row.original.company_name}
        onChange={(value) =>
          onUpdateJob(row.original.id, 'company_name', value)
        }
      />
    ),
  });

  // Position column
  tableColumns.push({
    id: 'position',
    accessorKey: 'job_title',
    header: 'Position',
    size: 200,
    cell: ({ row }) => (
      <TextCell
        value={row.original.job_title}
        onChange={(value) => onUpdateJob(row.original.id, 'job_title', value)}
      />
    ),
  });

  // Stage column
  tableColumns.push({
    id: 'stage',
    accessorKey: 'stage_id',
    header: 'Stage',
    size: 150,
    cell: ({ row }) => (
      <StageCell
        value={row.original.stage_id}
        stage={row.original.stage}
        stages={stages}
        onChange={(stageId) =>
          onUpdateJob(row.original.id, 'stage_id', stageId)
        }
      />
    ),
  });

  // Applied date column
  tableColumns.push({
    id: 'applied',
    accessorKey: 'applied_at',
    header: 'Applied',
    size: 150,
    cell: ({ row }) => (
      <DateCell
        value={row.original.applied_at ?? null}
        onChange={(value) => onUpdateJob(row.original.id, 'applied_at', value)}
      />
    ),
  });

  // Custom columns from API
  for (const col of columns) {
    tableColumns.push(createCustomColumn(col, onUpdateColumnValue));
  }

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

// Helper to create custom column definitions
function createCustomColumn(
  column: JobColumn,
  onUpdateColumnValue: (
    jobId: string,
    columnId: string,
    value: Record<string, unknown>
  ) => void
): ColumnDef<JobApplicationWithStage> {
  // Note: column_values are not included in the list response (JobApplicationWithStage)
  // Custom column values would need to be fetched separately or included in a detailed view

  const baseColumn: Partial<ColumnDef<JobApplicationWithStage>> = {
    id: column.id,
    header: column.name,
    size: 150,
  };

  switch (column.column_type) {
    case 'text':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <TextCell
            value=""
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                text_value: value,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'number':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <TextCell
            value=""
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                text_value: value,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'date':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <DateCell
            value={null}
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                text_value: value,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'url':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <UrlCell
            value={null}
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                text_value: value,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'checkbox':
      return {
        ...baseColumn,
        size: 80,
        cell: ({ row }) => (
          <CheckboxCell
            value={false}
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                text_value: value ? 'true' : 'false',
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'select':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <SelectCell
            value={null}
            options={
              column.options?.map((opt) => ({
                id: opt.id,
                value: opt.label,
                color: opt.color,
              })) ?? []
            }
            onChange={(value) =>
              onUpdateColumnValue(row.original.id, column.id, {
                option_id: value,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    case 'multi_select':
      return {
        ...baseColumn,
        cell: ({ row }) => (
          <MultiSelectCell
            values={[]}
            options={
              column.options?.map((opt) => ({
                id: opt.id,
                value: opt.label,
                color: opt.color,
              })) ?? []
            }
            onChange={(values) =>
              onUpdateColumnValue(row.original.id, column.id, {
                option_ids: values,
              })
            }
          />
        ),
      } as ColumnDef<JobApplicationWithStage>;

    default:
      return {
        ...baseColumn,
        cell: () => <span className="text-muted-foreground">-</span>,
      } as ColumnDef<JobApplicationWithStage>;
  }
}
