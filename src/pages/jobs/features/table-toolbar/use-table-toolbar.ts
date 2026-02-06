import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import { getDefaultFilterByColumnType } from '@/configs/zustand/jobs-table/jobs-table.helpers';
import { type ColumnType } from '@/configs/api/types/api.enums';
import { $api } from '@/configs/api/client';

export const useTableToolbar = () => {
  const sort = useJobsTableStore((state) => state.sort);
  const filters = useJobsTableStore((state) => state.filters);
  const addFilter = useJobsTableStore((state) => state.addFilter);
  const clearAll = useJobsTableStore((state) => state.clearAll);
  const openFilter = useJobsTableStore((s) => s.openFilter);

  const hasActiveSortOrFilters = sort !== null || filters.length > 0;

  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  // Filter out columns that already have a filter applied
  const availableColumns = columns.filter(
    (column) => !filters.some((f) => f.columnId === column.id)
  );

  const handleAddFilter = (columnId: string) => {
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
  };

  return {
    columns,
    availableColumns,
    hasActiveSortOrFilters,
    handleAddFilter,
    clearAll,
  };
};
