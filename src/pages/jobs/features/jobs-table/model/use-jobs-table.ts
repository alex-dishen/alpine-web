import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { arrayMove } from '@dnd-kit/sortable';
import { createJobColumns } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory';
import { useJobsData } from '@/pages/jobs/features/jobs-table/model/use-jobs-data';
import type { ColumnHeaderCallbacks } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory.types';
import { useJobsPreferences } from '@/features/preferences/model/use-jobs-preferences';
import { useFilterDropdownStore } from '@/pages/jobs/features/jobs-table/model/filter-dropdown.store';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

export const useJobsTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get filter actions from preferences
  const { addSort, addFilter, sorts, columnFilters } = useJobsPreferences();
  const openFilterDropdown = useFilterDropdownStore((s) => s.openFilter);

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
      onSort: addSort,
      onFilter: (columnId) => {
        const column = columns.find((c) => c.id === columnId);
        const columnType = column?.column_type;

        // Set appropriate default operator based on column type
        let defaultOperator: string;
        let defaultValue: unknown;

        switch (columnType) {
          case 'select':
          case 'multi_select':
            defaultOperator = 'is_any_of';
            defaultValue = [];
            break;
          case 'date':
            defaultOperator = 'equals'; // "Is" operator for dates
            defaultValue = '';
            break;
          case 'number':
            defaultOperator = 'equals';
            defaultValue = '';
            break;
          case 'checkbox':
            defaultOperator = 'equals';
            defaultValue = undefined; // No default - user must select
            break;
          default:
            defaultOperator = 'contains';
            defaultValue = '';
        }

        addFilter(columnId, defaultOperator, defaultValue);
        openFilterDropdown(columnId);
      },
      onRenameColumn: (_columnId, _newName) => {
        // TODO: Implement column rename API call
      },
      onDeleteColumn: (_columnId) => {
        // TODO: Implement delete column confirmation
      },
      getHasActiveSort: (columnId) => {
        return sorts.some((s) => s.columnId === columnId);
      },
      getHasActiveFilter: (columnId) => {
        const filter = columnFilters.find((f) => f.columnId === columnId);

        if (!filter) return false;

        // Operators that don't need a value
        const noValueOperators = ['is_empty', 'is_not_empty'];

        if (noValueOperators.includes(filter.operator)) return true;

        // Check if filter has a value
        const column = columns.find((c) => c.id === columnId);
        const isSelectType =
          column?.column_type === 'select' ||
          column?.column_type === 'multi_select';
        const isCheckboxType = column?.column_type === 'checkbox';

        if (isSelectType) {
          const selectedIds = (filter.value as string[]) ?? [];
          return selectedIds.length > 0;
        }

        // Checkbox always has a value (true or false)
        if (isCheckboxType) {
          return filter.value !== undefined;
        }

        // Handle array values (e.g., "between" operator with [startDate, endDate])
        if (Array.isArray(filter.value)) {
          if (filter.operator === 'between') {
            // Both dates must be filled for "between" to be active
            return (
              filter.value.length === 2 &&
              filter.value[0] !== '' &&
              filter.value[1] !== ''
            );
          }
          return filter.value.length > 0;
        }

        const value = filter.value as string;
        return Boolean(value && value.trim());
      },
    }),
    [columns, addSort, addFilter, sorts, columnFilters, openFilterDropdown]
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
