import { useCallback } from 'react';
import { useJobsFiltersStore } from '@/configs/zustand/jobs-filters/jobs-filters.store';
import {
  getDefaultFilterByColumnType,
  type ColumnFilter,
} from '@/configs/zustand/jobs-filters/jobs-filters.helpers';
import {
  COLUMN_TYPES,
  FILTER_OPERATORS,
  type FilterOperator,
} from '@/configs/api/types/api.enums';
import {
  NO_VALUE_OPERATORS,
  getOperatorsForColumnType,
} from '@/pages/jobs/registry/filter-operators';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type UseFilterChipProps = {
  filter: ColumnFilter;
  columns: JobColumn[];
};

export const useFilterChip = ({ filter, columns }: UseFilterChipProps) => {
  const column = columns.find((c) => c.id === filter.columnId);
  const columnType = filter.columnType ?? column?.column_type;
  const isSelectType =
    columnType === COLUMN_TYPES.SELECT ||
    columnType === COLUMN_TYPES.MULTI_SELECT;
  const isCheckboxType = columnType === COLUMN_TYPES.CHECKBOX;
  const isBetweenOperator = filter.operator === FILTER_OPERATORS.BETWEEN;

  // Subscribe to filter dropdown state
  const open = useJobsFiltersStore(
    (s) => s.openFilterColumnId === filter.columnId
  );
  const setFilterOpen = useJobsFiltersStore((s) => s.setFilterOpen);
  const canCloseFilter = useJobsFiltersStore((s) => s.canCloseFilter);

  // Get filter actions from store
  const updateFilter = useJobsFiltersStore((state) => state.updateFilter);
  const removeFilter = useJobsFiltersStore((state) => state.removeFilter);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => setFilterOpen(filter.columnId, newOpen),
    [filter.columnId, setFilterOpen]
  );

  const handleFocusOutside = useCallback(
    (e: Event) => {
      if (!canCloseFilter()) {
        e.preventDefault();
      }
    },
    [canCloseFilter]
  );

  const columnName = filter.columnName;
  const operators = getOperatorsForColumnType(columnType);
  const operator = operators.find((o) => o.value === filter.operator);
  const operatorLabel = operator?.label.toLowerCase() ?? filter.operator;
  const needsValue = !NO_VALUE_OPERATORS.includes(filter.operator);

  const hasValue = (() => {
    if (NO_VALUE_OPERATORS.includes(filter.operator)) return true;

    if (isSelectType) {
      const selectedIds = (filter.value as string[]) ?? [];

      return selectedIds.length > 0;
    }

    if (isCheckboxType) {
      return filter.value !== undefined;
    }

    if (isBetweenOperator) {
      const dates = filter.value as string[] | undefined;

      return Boolean(dates?.[0] && dates?.[1]);
    }

    if (typeof filter.value === 'string') {
      return Boolean(filter.value.trim());
    }

    return Boolean(filter.value);
  })();

  const handleOperatorChange = (newOperator: FilterOperator) => {
    if (NO_VALUE_OPERATORS.includes(newOperator)) {
      updateFilter(filter.columnId, {
        operator: newOperator,
        value: undefined,
      });
    } else if (newOperator === FILTER_OPERATORS.BETWEEN) {
      updateFilter(filter.columnId, { operator: newOperator, value: ['', ''] });
    } else if (filter.operator === FILTER_OPERATORS.BETWEEN) {
      updateFilter(filter.columnId, { operator: newOperator, value: '' });
    } else {
      updateFilter(filter.columnId, { operator: newOperator });
    }
  };

  const handleValueChange = (value: string) => {
    updateFilter(filter.columnId, { value });
  };

  const handleDateRangeChange = (value: string[]) => {
    updateFilter(filter.columnId, { value });
  };

  const handleOptionToggle = (optionId: string) => {
    const currentValues = (filter.value as string[]) ?? [];
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter((id) => id !== optionId)
      : [...currentValues, optionId];
    updateFilter(filter.columnId, { value: newValues });
  };

  const handleCheckboxValueChange = (value: boolean) => {
    updateFilter(filter.columnId, { value });
  };

  const handleClearValue = () => {
    const defaults = getDefaultFilterByColumnType(columnType);

    if (
      filter.operator === FILTER_OPERATORS.IS_EMPTY ||
      filter.operator === FILTER_OPERATORS.IS_NOT_EMPTY
    ) {
      updateFilter(filter.columnId, {
        operator: defaults.operator,
        value: defaults.value,
      });
    } else if (isBetweenOperator) {
      updateFilter(filter.columnId, { value: ['', ''] });
    } else {
      updateFilter(filter.columnId, { value: defaults.value });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFilter(filter.columnId);
  };

  const handleDelete = () => {
    removeFilter(filter.columnId);
    handleOpenChange(false);
  };

  return {
    open,
    column,
    hasValue,
    operators,
    columnType,
    columnName,
    needsValue,
    operatorLabel,
    isBetweenOperator,
    filterValue: filter.value,
    filterOperator: filter.operator,
    handleRemove,
    handleDelete,
    handleOpenChange,
    handleClearValue,
    handleValueChange,
    handleFocusOutside,
    handleOptionToggle,
    handleOperatorChange,
    handleDateRangeChange,
    handleCheckboxValueChange,
  };
};
