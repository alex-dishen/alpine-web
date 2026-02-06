import { Skeleton } from '@/shared/shadcn/components/skeleton';
import { useJobsTable } from '@/pages/jobs/features/jobs-table/model/use-jobs-table';
import { DraggableHeader } from '@/pages/jobs/features/jobs-table/ui/draggable-header';
import { TableBodyContent } from '@/pages/jobs/features/jobs-table/ui/table-body-content';
import { ScrollShadows } from '@/pages/jobs/features/jobs-table/ui/scroll-shadows';
import { Table, TableHeader, TableRow } from '@/shared/shadcn/components/table';
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
    rows,
    sensors,
    isLoading,
    totalSize,
    isResizing,
    virtualRows,
    columnOrder,
    hasNextPage,
    headerGroups,
    centerTotalSize,
    tableContainerRef,
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        <ScrollShadows containerRef={tableContainerRef} />

        <div
          ref={tableContainerRef}
          className="h-[calc(100vh-280px)] overflow-auto [&_[data-slot=table-container]]:overflow-visible"
          onScroll={handleScroll}
        >
          <Table className="table-fixed" style={{ width: centerTotalSize }}>
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
            <TableBodyContent
              rows={rows}
              virtualRows={virtualRows}
              totalSize={totalSize}
              columnCount={headerGroups[0]?.headers.length || 1}
              isResizing={isResizing}
              handleOpenDetail={handleOpenDetail}
            />
          </Table>

          {hasNextPage && (
            <div className="flex items-center justify-center py-4">
              <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
              <span className="text-muted-foreground ml-2 text-sm">
                Loading more...
              </span>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
};
