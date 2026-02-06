import {
  COLUMN_TYPES,
  FILTER_OPERATORS,
  type ColumnType,
  type FilterOperator,
} from '@/configs/api/types/api.enums';

type OperatorOption = { value: FilterOperator; label: string };

export const TEXT_OPERATORS: OperatorOption[] = [
  { value: FILTER_OPERATORS.EQUALS, label: 'Is' },
  { value: FILTER_OPERATORS.NOT_EQUALS, label: 'Is not' },
  { value: FILTER_OPERATORS.CONTAINS, label: 'Contains' },
  { value: FILTER_OPERATORS.NOT_CONTAINS, label: 'Does not contain' },
  { value: FILTER_OPERATORS.STARTS_WITH, label: 'Starts with' },
  { value: FILTER_OPERATORS.ENDS_WITH, label: 'Ends with' },
  { value: FILTER_OPERATORS.IS_EMPTY, label: 'Is empty' },
  { value: FILTER_OPERATORS.IS_NOT_EMPTY, label: 'Is not empty' },
];

export const SELECT_OPERATORS: OperatorOption[] = [
  { value: FILTER_OPERATORS.IS_ANY_OF, label: 'Is any of' },
  { value: FILTER_OPERATORS.IS_NONE_OF, label: 'Is none of' },
  { value: FILTER_OPERATORS.IS_EMPTY, label: 'Is empty' },
  { value: FILTER_OPERATORS.IS_NOT_EMPTY, label: 'Is not empty' },
];

export const DATE_OPERATORS: OperatorOption[] = [
  { value: FILTER_OPERATORS.EQUALS, label: 'Is' },
  { value: FILTER_OPERATORS.LT, label: 'Is before' },
  { value: FILTER_OPERATORS.GT, label: 'Is after' },
  { value: FILTER_OPERATORS.LTE, label: 'Is on or before' },
  { value: FILTER_OPERATORS.GTE, label: 'Is on or after' },
  { value: FILTER_OPERATORS.BETWEEN, label: 'Is between' },
  { value: FILTER_OPERATORS.IS_EMPTY, label: 'Is empty' },
  { value: FILTER_OPERATORS.IS_NOT_EMPTY, label: 'Is not empty' },
];

export const NUMBER_OPERATORS: OperatorOption[] = [
  { value: FILTER_OPERATORS.EQUALS, label: 'Is' },
  { value: FILTER_OPERATORS.NOT_EQUALS, label: 'Is not' },
  { value: FILTER_OPERATORS.GT, label: 'Greater than' },
  { value: FILTER_OPERATORS.LT, label: 'Less than' },
  { value: FILTER_OPERATORS.GTE, label: 'Greater than or equal' },
  { value: FILTER_OPERATORS.LTE, label: 'Less than or equal' },
  { value: FILTER_OPERATORS.IS_EMPTY, label: 'Is empty' },
  { value: FILTER_OPERATORS.IS_NOT_EMPTY, label: 'Is not empty' },
];

export const CHECKBOX_OPERATORS: OperatorOption[] = [
  { value: FILTER_OPERATORS.EQUALS, label: 'Is' },
  { value: FILTER_OPERATORS.NOT_EQUALS, label: 'Is not' },
];

export const CHECKBOX_VALUES = [
  { value: true, label: 'Checked' },
  { value: false, label: 'Unchecked' },
] as const;

export const NO_VALUE_OPERATORS: FilterOperator[] = [
  FILTER_OPERATORS.IS_EMPTY,
  FILTER_OPERATORS.IS_NOT_EMPTY,
];

// Helper to get operators based on column type
export const getOperatorsForColumnType = (
  columnType: ColumnType | undefined
): OperatorOption[] => {
  switch (columnType) {
    case COLUMN_TYPES.SELECT:
    case COLUMN_TYPES.MULTI_SELECT:
      return SELECT_OPERATORS;
    case COLUMN_TYPES.DATE:
      return DATE_OPERATORS;
    case COLUMN_TYPES.NUMBER:
      return NUMBER_OPERATORS;
    case COLUMN_TYPES.CHECKBOX:
      return CHECKBOX_OPERATORS;
    default:
      return TEXT_OPERATORS;
  }
};
