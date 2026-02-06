import { Badge } from '@/shared/shadcn/components/badge';
import { Checkbox } from '@/shared/shadcn/components/checkbox';
import { cn } from '@/shared/shadcn/utils/utils';
import { COLUMN_TYPES, type ColumnType } from '@/configs/api/types/api.enums';
import { CHECKBOX_VALUES } from '@/pages/jobs/registry/filter-operators';
import { FilterTextInput } from '@/pages/jobs/features/filter-chips/ui/filter-text-input';
import { FilterNumberInput } from '@/pages/jobs/features/filter-chips/ui/filter-number-input';
import { FilterDateInput } from '@/pages/jobs/features/filter-chips/ui/filter-date-input';
import { FilterDateRangeInput } from '@/pages/jobs/features/filter-chips/ui/filter-date-range-input/filter-date-range-input';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type FilterValueInputProps = {
  value: unknown;
  options?: JobColumn['options'];
  isBetweenOperator: boolean;
  onValueChange: (value: string) => void;
  onDateRangeChange: (value: string[]) => void;
  onOptionToggle: (optionId: string) => void;
  onCheckboxValueChange: (value: boolean) => void;
};

type FilterValueInputFactory = (
  props: FilterValueInputProps
) => React.ReactNode;

const renderSelectInput: FilterValueInputFactory = ({
  value,
  options,
  onOptionToggle,
}) => {
  const selectedIds = (value as string[]) ?? [];

  return (
    <div className="max-h-64 space-y-1 overflow-y-auto">
      {options?.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <div
            key={option.id}
            className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-2 py-1.5"
            onClick={() => onOptionToggle(option.id)}
          >
            <Checkbox checked={isSelected} className="pointer-events-none" />
            <Badge
              variant="secondary"
              style={{
                backgroundColor: option.color ? `${option.color}20` : undefined,
                color: option.color ?? undefined,
              }}
            >
              {option.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

const renderCheckboxInput: FilterValueInputFactory = ({
  value,
  onCheckboxValueChange,
}) => (
  <div className="space-y-1">
    {CHECKBOX_VALUES.map((option) => {
      const isSelected = value === option.value;

      return (
        <div
          key={String(option.value)}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5',
            isSelected ? 'bg-accent' : 'hover:bg-accent'
          )}
          onClick={() => onCheckboxValueChange(option.value)}
        >
          <span className="text-sm">{option.label}</span>
        </div>
      );
    })}
  </div>
);

const renderDateInput: FilterValueInputFactory = ({
  value,
  isBetweenOperator,
  onValueChange,
  onDateRangeChange,
}) =>
  isBetweenOperator ? (
    <FilterDateRangeInput
      value={(value as string[]) ?? ['', '']}
      onChange={onDateRangeChange}
    />
  ) : (
    <FilterDateInput value={(value as string) ?? ''} onChange={onValueChange} />
  );

const renderNumberInput: FilterValueInputFactory = ({
  value,
  onValueChange,
}) => (
  <FilterNumberInput value={(value as string) ?? ''} onChange={onValueChange} />
);

const renderTextInput: FilterValueInputFactory = ({ value, onValueChange }) => (
  <FilterTextInput value={(value as string) ?? ''} onChange={onValueChange} />
);

const filterValueInputs: Record<string, FilterValueInputFactory> = {
  [COLUMN_TYPES.SELECT]: renderSelectInput,
  [COLUMN_TYPES.MULTI_SELECT]: renderSelectInput,
  [COLUMN_TYPES.CHECKBOX]: renderCheckboxInput,
  [COLUMN_TYPES.DATE]: renderDateInput,
  [COLUMN_TYPES.NUMBER]: renderNumberInput,
  [COLUMN_TYPES.TEXT]: renderTextInput,
  [COLUMN_TYPES.URL]: renderTextInput,
};

export const getFilterValueInput = (
  columnType: ColumnType | undefined,
  props: FilterValueInputProps
): React.ReactNode => {
  const factory =
    filterValueInputs[columnType ?? COLUMN_TYPES.TEXT] ?? renderTextInput;

  return factory(props);
};
