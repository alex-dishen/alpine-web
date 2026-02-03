import { cn } from '@/shared/shadcn/utils/utils';
import { flexRender } from '@tanstack/react-table';
import { Skeleton } from '@/shared/shadcn/components/skeleton';
import { useJobsTable } from '@/pages/jobs/features/jobs-table/model/use-jobs-table';
import { DraggableHeader } from '@/pages/jobs/features/jobs-table/ui/draggable-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/table';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

export const JobsTable = () => {
  const {
    jobs,
    rows,
    sensors,
    isLoading,
    totalSize,
    virtualRows,
    columnOrder,
    headerGroups,
    tableContainerRef,
    isFetchingNextPage,
    handleScroll,
    handleDragEnd,
    handleOpenDetail,
  } = useJobsTable();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const isEmpty = jobs.length === 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={tableContainerRef}
        className="relative h-[calc(100vh-280px)] overflow-auto [&_[data-slot=table-container]]:overflow-visible"
        onScroll={handleScroll}
      >
        <Table>
          <TableHeader className="bg-background sticky top-0 z-10">
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={headerGroups[0]?.headers.length || 1}
                  className="h-[300px] text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium">No jobs found</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Add your first job application to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
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
                        virtualRow.index % 2 === 0
                          ? 'bg-background'
                          : 'bg-muted/30'
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
              </>
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
    </DndContext>
  );
};
