import type { components } from '@/configs/api/types/api.generated';

/**
 * Column type from the API schema.
 */
export type ColumnType =
  components['schemas']['JobColumnWithOptionsResponseDto']['column_type'];

/**
 * Column types matching the API schema.
 * Use COLUMN_TYPES for runtime checks/iterations, ColumnType for type annotations.
 */
export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  URL: 'url',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  MULTI_SELECT: 'multi_select',
} as const satisfies Record<string, ColumnType>;

/**
 * Filter operator from the API schema.
 */
export type FilterOperator =
  components['schemas']['ColumnFilterDto']['operator'];

/**
 * Filter operators matching the API schema.
 * Use FILTER_OPERATORS for runtime checks/iterations, FilterOperator for type annotations.
 */
export const FILTER_OPERATORS = {
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
  GT: 'gt',
  LT: 'lt',
  GTE: 'gte',
  LTE: 'lte',
  BETWEEN: 'between',
  IS_TRUE: 'is_true',
  IS_FALSE: 'is_false',
  IS_ANY_OF: 'is_any_of',
  IS_NONE_OF: 'is_none_of',
} as const satisfies Record<string, FilterOperator>;
