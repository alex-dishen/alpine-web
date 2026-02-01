import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { arrayMove } from '@dnd-kit/sortable';
import { createJobColumns } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory';
import { useJobsData } from '@/pages/jobs/features/jobs-table/model/use-jobs-data';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

type UseJobsTableProps = {
  filters: JobFilters;
};

export const useJobsTable = ({ filters }: UseJobsTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get business data
  const {
    jobs,
    columns,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleOpenDetail,
    handleUpdateJob,
    handleUpdateColumnValue,
    handleDeleteJob,
  } = useJobsData({ filters });

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 33,
    overscan: 100,
  });

  // Infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < 700 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Table columns
  const tableColumns = useMemo(
    () =>
      createJobColumns({
        columns,
        onUpdateJob: handleUpdateJob,
        onUpdateColumnValue: handleUpdateColumnValue,
        onDeleteJob: handleDeleteJob,
        onOpenDetail: handleOpenDetail,
      }),
    [
      columns,
      handleUpdateJob,
      handleUpdateColumnValue,
      handleDeleteJob,
      handleOpenDetail,
    ]
  );

  // Column ordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const currentColumnIds = useMemo(
    () => tableColumns.map((col) => col.id as string),
    [tableColumns]
  );

  useEffect(() => {
    if (currentColumnIds.length === 0) return;

    setColumnOrder((prevOrder) => {
      const existingOrder = prevOrder.filter((id) =>
        currentColumnIds.includes(id)
      );
      const newColumns = currentColumnIds.filter(
        (id) => !prevOrder.includes(id)
      );

      if (
        newColumns.length === 0 &&
        existingOrder.length === prevOrder.length
      ) {
        return prevOrder;
      }

      return [...existingOrder, ...newColumns];
    });
  }, [currentColumnIds]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumnOrder((current) => {
        const oldIndex = current.indexOf(active.id as string);
        const newIndex = current.indexOf(over.id as string);

        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }, []);

  // Table instance
  const table = useReactTable({
    data: jobs,
    columns: tableColumns,
    state: { columnOrder },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
  });

  return {
    jobs,
    sensors,
    isLoading,
    columnOrder,
    tableContainerRef,
    isFetchingNextPage,
    rows: table.getRowModel().rows,
    totalSize: virtualizer.getTotalSize(),
    headerGroups: table.getHeaderGroups(),
    virtualRows: virtualizer.getVirtualItems(),
    handleScroll,
    handleDragEnd,
    handleOpenDetail,
  };
};
