import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { arrayMove } from '@dnd-kit/sortable';
import { createJobColumns } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory';
import { useJobsData } from '@/pages/jobs/features/jobs-table/model/use-jobs-data';
import type { ColumnHeaderCallbacks } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory.types';
import { useJobsFiltersStore } from '@/configs/zustand/jobs-filters/jobs-filters.store';
import {
  getDefaultFilterByColumnType,
  isFilterActive,
} from '@/configs/zustand/jobs-filters/jobs-filters.helpers';
import { type ColumnType } from '@/configs/api/types/api.enums';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

export const useJobsTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get filter actions from store (only actions, not state - to avoid re-renders)
  const setSort = useJobsFiltersStore((state) => state.setSort);
  const addFilter = useJobsFiltersStore((state) => state.addFilter);
  const openFilter = useJobsFiltersStore((s) => s.openFilter);

  // Get business data - useJobsData -> useJobsList subscribes to filters internally
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
  } = useJobsData();

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

  // Column header callbacks for dropdown menu
  // Uses store.getState() for getHasActiveSort/getHasActiveFilter to read current state without subscribing
  const columnHeaderCallbacks: ColumnHeaderCallbacks = useMemo(
    () => ({
      onSort: (columnId, columnName, direction) =>
        setSort({ columnId, columnName, direction }),
      onFilter: (columnId) => {
        const column = columns.find((c) => c.id === columnId);
        const columnName = column?.name ?? columnId;
        const columnType = column?.column_type as ColumnType | undefined;
        // Use field_key for core columns, id for custom columns
        const apiColumnId =
          column?.is_core && column?.field_key ? column.field_key : columnId;

        const defaults = getDefaultFilterByColumnType(columnType);

        addFilter({
          columnId,
          columnName,
          apiColumnId,
          columnType,
          operator: defaults.operator,
          value: defaults.value,
        });
        openFilter(columnId);
      },
      onRenameColumn: (_columnId, _newName) => {
        // TODO: Implement column rename API call
      },
      onDeleteColumn: (_columnId) => {
        // TODO: Implement delete column confirmation
      },
      getHasActiveSort: (columnId) => {
        // Read current state without subscribing to avoid re-renders
        const { sort } = useJobsFiltersStore.getState();

        return sort?.columnId === columnId;
      },
      getHasActiveFilter: (columnId) => {
        const { filters } = useJobsFiltersStore.getState();
        const filter = filters.find((f) => f.columnId === columnId);

        if (!filter) return false;

        return isFilterActive(filter);
      },
    }),
    [columns, setSort, addFilter, openFilter]
  );

  // Table columns
  const tableColumns = useMemo(
    () =>
      createJobColumns({
        columns,
        onUpdateJob: handleUpdateJob,
        onUpdateColumnValue: handleUpdateColumnValue,
        columnHeaderCallbacks,
      }),
    [columns, handleUpdateJob, handleUpdateColumnValue, columnHeaderCallbacks]
  );

  // Column ordering - low distance threshold so drag activates quickly
  // Click vs drag is determined by whether movement happened during drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
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
