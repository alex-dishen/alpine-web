import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { arrayMove } from '@dnd-kit/sortable';
import { createJobColumns } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory';
import { useJobsData } from '@/pages/jobs/features/jobs-table/model/use-jobs-data';
import type { ColumnHeaderCallbacks } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory.types';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import {
  getDefaultFilterByColumnType,
  isFilterActive,
} from '@/configs/zustand/jobs-table/jobs-table.helpers';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import { type ColumnType } from '@/configs/api/types/api.enums';
import { useUpdateColumn } from '@/pages/jobs/model/use-update-column';
import { useDeleteColumn } from '@/pages/jobs/model/use-delete-column';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

export const useJobsTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const openModal = useModalsStore((state) => state.openModal);
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  // Get filter actions from store (only actions, not state - to avoid re-renders)
  const setSort = useJobsTableStore((state) => state.setSort);
  const addFilter = useJobsTableStore((state) => state.addFilter);
  const openFilter = useJobsTableStore((s) => s.openFilter);

  // Column sizing & ordering (persisted in store)
  const columnSizing = useJobsTableStore((state) => state.columnSizing);
  const setColumnSizing = useJobsTableStore((state) => state.setColumnSizing);
  const columnOrder = useJobsTableStore((state) => state.columnOrder);
  const setColumnOrder = useJobsTableStore((state) => state.setColumnOrder);

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

  // Virtualizer — custom observeElementOffset to skip horizontal-only scroll events
  const virtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 33,
    overscan: 100,
    observeElementOffset: (instance, cb) => {
      const element = instance.scrollElement;

      if (!element) return;

      let prevOffset = element.scrollTop;
      let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

      const handler = () => {
        const offset = element.scrollTop;

        if (offset === prevOffset) return;

        prevOffset = offset;

        if (scrollEndTimer) clearTimeout(scrollEndTimer);

        cb(offset, true);

        scrollEndTimer = setTimeout(() => {
          cb(offset, false);
        }, instance.options.isScrollingResetDelay);
      };

      cb(element.scrollTop, false);

      element.addEventListener('scroll', handler, { passive: true });

      return () => {
        element.removeEventListener('scroll', handler);

        if (scrollEndTimer) clearTimeout(scrollEndTimer);
      };
    },
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
      onRenameColumn: (columnId, newName) => {
        const trimmed = newName.trim();

        if (!trimmed) return;

        updateColumn.mutate({
          params: { path: { id: columnId } },
          body: { name: trimmed },
        });
      },
      onDeleteColumn: (columnId) => {
        openModal(MODALS.Confirm, {
          title: 'Delete Column',
          description:
            'Are you sure you want to delete this column? This action cannot be undone.',
          confirmLabel: 'Delete',
          variant: 'destructive',
          onConfirm: () => {
            deleteColumn.mutate({ params: { path: { id: columnId } } });
          },
        });
      },
      getHasActiveSort: (columnId) => {
        // Read current state without subscribing to avoid re-renders
        const { sort } = useJobsTableStore.getState();

        return sort?.columnId === columnId;
      },
      getHasActiveFilter: (columnId) => {
        const { filters } = useJobsTableStore.getState();
        const filter = filters.find((f) => f.columnId === columnId);

        if (!filter) return false;

        return isFilterActive(filter);
      },
    }),
    [
      columns,
      deleteColumn,
      updateColumn,
      setSort,
      addFilter,
      openFilter,
      openModal,
    ]
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
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: { columnOrder, columnSizing },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
  });

  const centerTotalSize = table.getCenterTotalSize();

  return {
    sensors,
    isLoading,
    columnOrder,
    hasNextPage,
    centerTotalSize,
    tableContainerRef,
    rows: table.getRowModel().rows,
    totalSize: virtualizer.getTotalSize(),
    headerGroups: table.getHeaderGroups(),
    virtualRows: virtualizer.getVirtualItems(),
    isResizing: !!table.getState().columnSizingInfo.isResizingColumn,
    handleScroll,
    handleDragEnd,
    handleOpenDetail,
  };
};
