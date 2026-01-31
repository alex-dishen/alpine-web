import { flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/table';
import { Skeleton } from '@/shared/shadcn/components/skeleton';
import { cn } from '@/shared/shadcn/utils/utils';
import { useJobsTable } from '@/pages/jobs/features/jobs-table/model/use-jobs-table';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

type JobsTableProps = {
  filters: JobFilters;
};

export const JobsTable = ({ filters }: JobsTableProps) => {
  const {
    jobs,
    isLoading,
    isFetchingNextPage,
    tableContainerRef,
    virtualRows,
    totalSize,
    headerGroups,
    rows,
    handleScroll,
    handleOpenDetail,
  } = useJobsTable({ filters });

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Add your first job application to get started
        </p>
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="relative h-[calc(100vh-280px)] overflow-auto"
      onScroll={handleScroll}
    >
      <Table>
        <TableHeader className="bg-background sticky top-0 z-10">
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="border-r last:border-r-0"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {virtualRows.length > 0 && virtualRows[0].start > 0 && (
            <tr style={{ height: virtualRows[0].start }} />
          )}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            if (!row) return null;

            return (
              <TableRow
                key={row.id}
                data-index={virtualRow.index}
                className={cn(
                  'cursor-pointer transition-colors',
                  virtualRow.index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                )}
                onClick={() => handleOpenDetail(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="border-r p-0 last:border-r-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {virtualRows.length > 0 && (
            <tr
              style={{
                height:
                  totalSize -
                  virtualRows[virtualRows.length - 1].start -
                  virtualRows[virtualRows.length - 1].size,
              }}
            />
          )}
        </TableBody>
      </Table>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-muted-foreground ml-2 text-sm">
            Loading more...
          </span>
        </div>
      )}
    </div>
  );
};
