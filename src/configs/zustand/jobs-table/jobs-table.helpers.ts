import {
  COLUMN_TYPES,
  FILTER_OPERATORS,
  type ColumnType,
  type FilterOperator,
} from '@/configs/api/types/api.enums';
import { NO_VALUE_OPERATORS } from '@/pages/jobs/registry/filter-operators';

export type ColumnFilter = {
  columnId: string;
  columnName: string;
  apiColumnId: string; // field_key for core columns, id for custom columns
  columnType?: ColumnType;
  operator: FilterOperator;
  value?: unknown;
};

export type Sort = {
  columnId: string;
  columnName: string;
  direction: 'asc' | 'desc';
};

export const isFilterActive = (filter: ColumnFilter): boolean => {
  if (NO_VALUE_OPERATORS.includes(filter.operator)) return true;

  if (Array.isArray(filter.value)) {
    if (filter.operator === FILTER_OPERATORS.BETWEEN) {
      return (
        filter.value.length === 2 &&
        filter.value[0] !== '' &&
        filter.value[1] !== ''
      );
    }

    return filter.value.length > 0;
  }

  if (typeof filter.value === 'boolean') return true;

  return filter.value !== undefined && filter.value !== '';
};

type FilterDefaults = {
  operator: FilterOperator;
  value: unknown;
};

export const getDefaultFilterByColumnType = (
  columnType: ColumnType | undefined
): FilterDefaults => {
  switch (columnType) {
    case COLUMN_TYPES.SELECT:
    case COLUMN_TYPES.MULTI_SELECT:
      return { operator: FILTER_OPERATORS.IS_ANY_OF, value: [] };
    case COLUMN_TYPES.DATE:
    case COLUMN_TYPES.NUMBER:
      return { operator: FILTER_OPERATORS.EQUALS, value: '' };
    case COLUMN_TYPES.CHECKBOX:
      return { operator: FILTER_OPERATORS.EQUALS, value: undefined };
    default:
      return { operator: FILTER_OPERATORS.CONTAINS, value: '' };
  }
};
