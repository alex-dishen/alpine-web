import { startOfDay, endOfDay, parseISO, isValid } from 'date-fns';
import type { ColumnFilter } from '@/configs/zustand/jobs-filters/jobs-filters.helpers';
import type { components } from '@/configs/api/types/api.generated';
import { COLUMN_TYPES, FILTER_OPERATORS } from '@/configs/api/types/api.enums';

type ApiColumnFilter = components['schemas']['ColumnFilterDto'];

/**
 * Maps store filters to API format, handling date transformations
 */
export const mapFiltersToApi = (filters: ColumnFilter[]): ApiColumnFilter[] => {
  return filters.map((f) => {
    const isDateType = f.columnType === COLUMN_TYPES.DATE;

    let operator = f.operator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = f.value;

    // For date fields, use date-fns to handle start/end of day for timestamp comparisons
    if (isDateType) {
      // Handle "between" operator with two dates
      if (f.operator === FILTER_OPERATORS.BETWEEN && Array.isArray(f.value)) {
        const [startDateStr, endDateStr] = f.value;

        if (startDateStr && endDateStr) {
          const startDate = parseISO(startDateStr);
          const endDate = parseISO(endDateStr);

          if (isValid(startDate) && isValid(endDate)) {
            value = [
              startOfDay(startDate).toISOString(),
              endOfDay(endDate).toISOString(),
            ];
          }
        }
      }
      // Handle single date operators
      else if (typeof f.value === 'string' && f.value) {
        const date = parseISO(f.value);

        if (isValid(date)) {
          switch (f.operator) {
            case FILTER_OPERATORS.EQUALS:
              operator = FILTER_OPERATORS.BETWEEN;
              value = [
                startOfDay(date).toISOString(),
                endOfDay(date).toISOString(),
              ];
              break;
            case FILTER_OPERATORS.LT:
              value = startOfDay(date).toISOString();
              break;
            case FILTER_OPERATORS.LTE:
              value = endOfDay(date).toISOString();
              break;
            case FILTER_OPERATORS.GT:
              value = endOfDay(date).toISOString();
              break;
            case FILTER_OPERATORS.GTE:
              value = startOfDay(date).toISOString();
              break;
          }
        }
      }
    }

    return {
      value,
      operator,
      column_id: f.apiColumnId,
      column_type: f.columnType,
    };
  });
};
