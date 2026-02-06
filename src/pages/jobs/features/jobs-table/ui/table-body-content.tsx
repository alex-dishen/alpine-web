import { memo } from 'react';
import { cn } from '@/shared/shadcn/utils/utils';
import { flexRender, type Row } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
import {
  TableBody,
  TableCell,
  TableRow,
} from '@/shared/shadcn/components/table';

type TableBodyContentProps = {
  rows: Row<JobApplicationWithStage>[];
  virtualRows: VirtualItem[];
  totalSize: number;
  columnCount: number;
  isResizing: boolean;
  handleOpenDetail: (id: string) => void;
};

function TableBodyContentInner({
  rows,
  virtualRows,
  totalSize,
  columnCount,
  handleOpenDetail,
}: TableBodyContentProps) {
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={columnCount} className="h-[300px] text-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add your first job application to get started
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
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
  );
}

export const TableBodyContent = memo(TableBodyContentInner, (_prev, next) => {
  // Skip body re-renders while resizing — table-fixed means headers control column widths
  if (next.isResizing) return true;

  return false;
});
