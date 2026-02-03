import { useCallback, useState, useRef } from 'react';
import type { DateRange } from 'react-day-picker';
import { ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { Badge } from '@/shared/shadcn/components/badge';
import { Input } from '@/shared/shadcn/components/input';
import { Checkbox } from '@/shared/shadcn/components/checkbox';
import { Calendar } from '@/shared/shadcn/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import { cn } from '@/shared/shadcn/utils/utils';
import { useFilterDropdownStore } from '@/pages/jobs/features/jobs-table/model/filter-dropdown.store';
import {
  useJobsPreferences,
  type PreferencesColumnFilter,
  type FilterOperator,
} from '@/features/preferences/model/use-jobs-preferences';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type FilterChipsProps = {
  columns: JobColumn[];
};

// Text column operators
const TEXT_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Is' },
  { value: 'not_equals', label: 'Is not' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does not contain' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
];

// Select/multi-select column operators
const SELECT_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'is_any_of', label: 'Is any of' },
  { value: 'is_none_of', label: 'Is none of' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
];

// Date column operators
const DATE_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Is' },
  { value: 'lt', label: 'Is before' },
  { value: 'gt', label: 'Is after' },
  { value: 'lte', label: 'Is on or before' },
  { value: 'gte', label: 'Is on or after' },
  { value: 'between', label: 'Is between' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
];

// Number column operators
const NUMBER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Is' },
  { value: 'not_equals', label: 'Is not' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'lte', label: 'Less than or equal' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
];

// Checkbox column operators
const CHECKBOX_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Is' },
  { value: 'not_equals', label: 'Is not' },
];

// Predefined checkbox values
const CHECKBOX_VALUES = [
  { value: true, label: 'Checked' },
  { value: false, label: 'Unchecked' },
];

const NO_VALUE_OPERATORS: FilterOperator[] = [
  'is_empty',
  'is_not_empty',
];

type FilterInputProps = {
  value: string;
  onChange: (value: string) => void;
};

// Uses local state for smooth typing, updates store immediately (store handles debouncing)
const FilterTextInput = ({ value, onChange }: FilterInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const isTypingRef = useRef(false);

  // Only sync from prop when not actively typing (prevents cursor jumping)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    setLocalValue(newValue);
    onChange(newValue); // Update store immediately, store handles debouncing
    // Reset typing flag after a short delay
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  // Sync local state when value prop changes (but not while typing)
  const valueRef = useRef(value);
  if (value !== valueRef.current && !isTypingRef.current) {
    valueRef.current = value;
    setLocalValue(value);
  }

  return (
    <Input
      value={localValue}
      onChange={handleChange}
      placeholder="Type a value..."
      className="h-8"
      autoFocus
    />
  );
};

// Number input that only accepts numeric characters
const FilterNumberInput = ({ value, onChange }: FilterInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const isTypingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow numbers, decimal point, and minus sign (for negative numbers)
    if (newValue !== '' && !/^-?\d*\.?\d*$/.test(newValue)) {
      return;
    }
    isTypingRef.current = true;
    setLocalValue(newValue);
    onChange(newValue);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const valueRef = useRef(value);
  if (value !== valueRef.current && !isTypingRef.current) {
    valueRef.current = value;
    setLocalValue(value);
  }

  return (
    <Input
      value={localValue}
      onChange={handleChange}
      placeholder="Enter a number..."
      className="h-8"
      autoFocus
      inputMode="decimal"
    />
  );
};

type FilterDateInputProps = {
  value: string;
  onChange: (value: string) => void;
};

// Parse date string to Date object for calendar
// Accepts formats: YYYY-MM-DD, YYYY/MM/DD
const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;

  // Normalize slashes to dashes
  const normalized = dateStr.replace(/\//g, '-');
  const date = new Date(normalized);

  return isNaN(date.getTime()) ? undefined : date;
};

// Format Date to YYYY-MM-DD string (using local timezone, not UTC)
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Format date for display input (YYYY/MM/DD for user typing)
const formatDateForInput = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  if (!date) return dateStr;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

// Single date input with calendar below - Notion style
const FilterDateInput = ({ value, onChange }: FilterDateInputProps) => {
  // Local state for display value (formatted as YYYY/MM/DD for typing)
  const [inputValue, setInputValue] = useState(formatDateForInput(value));
  const isTypingRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    setInputValue(newValue);

    // Only update store if we have a valid date (or empty)
    if (!newValue) {
      onChange('');
    } else {
      const parsed = parseDate(newValue);
      if (parsed) {
        onChange(formatDate(parsed));
      }
    }

    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = formatDate(date);
      setInputValue(formatDateForInput(formatted));
      onChange(formatted);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  // Sync local state when value prop changes (e.g., from store updates)
  const valueRef = useRef(value);
  if (value !== valueRef.current && !isTypingRef.current) {
    valueRef.current = value;
    setInputValue(formatDateForInput(value));
  }

  return (
    <div>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="YYYY/MM/DD"
          className="h-8 pr-8"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Calendar
        mode="single"
        selected={parseDate(inputValue)}
        onSelect={handleCalendarSelect}
        className="w-full pt-2"
      />
    </div>
  );
};

type FilterDateRangeInputProps = {
  value: string[]; // [startDate, endDate]
  onChange: (value: string[]) => void;
};

// Date range input for "between" operator - Notion style with range highlighting
const FilterDateRangeInput = ({ value, onChange }: FilterDateRangeInputProps) => {
  const startDate = value?.[0] ?? '';
  const endDate = value?.[1] ?? '';

  // Always have one field active - never null
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');

  // Track hovered date for preview
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();

  // Local state for input values (formatted as YYYY/MM/DD for typing)
  const [startInput, setStartInput] = useState(formatDateForInput(startDate));
  const [endInput, setEndInput] = useState(formatDateForInput(endDate));
  const isTypingRef = useRef(false);

  const startDateObj = parseDate(startDate);
  const endDateObj = parseDate(endDate);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    setStartInput(newValue);

    if (!newValue) {
      onChange(['', endDate]);
    } else {
      const parsed = parseDate(newValue);
      if (parsed) {
        // Validate: start can't be after end
        if (endDateObj && parsed > endDateObj) return;
        onChange([formatDate(parsed), endDate]);
      }
    }

    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    setEndInput(newValue);

    if (!newValue) {
      onChange([startDate, '']);
    } else {
      const parsed = parseDate(newValue);
      if (parsed) {
        // Validate: end can't be before start
        if (startDateObj && parsed < startDateObj) return;
        onChange([startDate, formatDate(parsed)]);
      }
    }

    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    const formatted = formatDate(date);

    if (activeField === 'start') {
      setStartInput(formatDateForInput(formatted));
      onChange([formatted, endDate]);
      // Auto-switch to end field after selecting start
      setActiveField('end');
    } else {
      setEndInput(formatDateForInput(formatted));
      onChange([startDate, formatted]);
    }
  };

  const handleClearStart = () => {
    setStartInput('');
    onChange(['', endDate]);
    setActiveField('start');
  };

  const handleClearEnd = () => {
    setEndInput('');
    onChange([startDate, '']);
    setActiveField('end');
  };

  // Sync local state when value prop changes
  const startRef = useRef(startDate);
  const endRef = useRef(endDate);
  if (startDate !== startRef.current && !isTypingRef.current) {
    startRef.current = startDate;
    setStartInput(formatDateForInput(startDate));
  }
  if (endDate !== endRef.current && !isTypingRef.current) {
    endRef.current = endDate;
    setEndInput(formatDateForInput(endDate));
  }

  // Determine disabled dates based on active field
  const getDisabledDates = () => {
    if (activeField === 'start' && endDateObj) {
      // Selecting start - disable dates after end
      return { after: endDateObj };
    }
    if (activeField === 'end' && startDateObj) {
      // Selecting end - disable dates before start
      return { before: startDateObj };
    }
    return undefined;
  };

  // Build modifiers for range highlighting including hover preview
  const getModifiers = () => {
    // Determine the effective range (including hover preview)
    let effectiveStart = startDateObj;
    let effectiveEnd = endDateObj;

    // Show hover preview
    if (hoveredDate) {
      if (activeField === 'end' && startDateObj && !endDateObj) {
        // Previewing end date selection
        if (hoveredDate >= startDateObj) {
          effectiveEnd = hoveredDate;
        }
      } else if (activeField === 'start' && endDateObj && !startDateObj) {
        // Previewing start date selection
        if (hoveredDate <= endDateObj) {
          effectiveStart = hoveredDate;
        }
      }
    }

    return {
      range_start: effectiveStart ? [effectiveStart] : [],
      range_end: effectiveEnd ? [effectiveEnd] : [],
      range_middle: effectiveStart && effectiveEnd && effectiveStart < effectiveEnd
        ? [{ after: effectiveStart, before: effectiveEnd }]
        : [],
    };
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={startInput}
            onChange={handleStartChange}
            onFocus={() => setActiveField('start')}
            placeholder="YYYY/MM/DD"
            className={cn(
              'h-8 pr-8 cursor-pointer',
              activeField === 'start' && 'ring-2 ring-ring'
            )}
            readOnly
            onClick={() => setActiveField('start')}
          />
          {startInput && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearStart();
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="relative flex-1">
          <Input
            value={endInput}
            onChange={handleEndChange}
            onFocus={() => setActiveField('end')}
            placeholder="YYYY/MM/DD"
            className={cn(
              'h-8 pr-8 cursor-pointer',
              activeField === 'end' && 'ring-2 ring-ring'
            )}
            readOnly
            onClick={() => setActiveField('end')}
          />
          {endInput && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearEnd();
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      <Calendar
        mode="single"
        selected={activeField === 'start' ? startDateObj : endDateObj}
        onSelect={handleCalendarSelect}
        disabled={getDisabledDates()}
        onDayMouseEnter={setHoveredDate}
        onDayMouseLeave={() => setHoveredDate(undefined)}
        modifiers={getModifiers()}
        modifiersClassNames={{
          range_start: 'bg-primary text-primary-foreground rounded-l-md rounded-r-none',
          range_end: 'bg-primary text-primary-foreground rounded-r-md rounded-l-none',
          range_middle: 'bg-accent text-accent-foreground rounded-none',
        }}
        className="w-full pt-2"
      />
    </div>
  );
};

type FilterChipProps = {
  filter: PreferencesColumnFilter;
  columns: JobColumn[];
};

// Helper to get operators based on column type
const getOperatorsForColumnType = (
  columnType: string | undefined
): { value: FilterOperator; label: string }[] => {
  switch (columnType) {
    case 'select':
    case 'multi_select':
      return SELECT_OPERATORS;
    case 'date':
      return DATE_OPERATORS;
    case 'number':
      return NUMBER_OPERATORS;
    case 'checkbox':
      return CHECKBOX_OPERATORS;
    default:
      return TEXT_OPERATORS;
  }
};

const FilterChip = ({ filter, columns }: FilterChipProps) => {
  const column = columns.find((c) => c.id === filter.columnId);
  const isSelectType =
    column?.column_type === 'select' || column?.column_type === 'multi_select';
  const isDateType = column?.column_type === 'date';
  const isCheckboxType = column?.column_type === 'checkbox';
  const isNumberType = column?.column_type === 'number';
  const isBetweenOperator = filter.operator === 'between';

  // Subscribe to dropdown store - only this chip re-renders when its open state changes
  const open = useFilterDropdownStore(
    (s) => s.openColumnId === filter.columnId
  );
  const setOpen = useFilterDropdownStore((s) => s.setOpen);
  const canClose = useFilterDropdownStore((s) => s.canClose);

  // Get filter actions from preferences
  const { updateFilter, removeFilter } = useJobsPreferences();

  const handleOpenChange = useCallback(
    (newOpen: boolean) => setOpen(filter.columnId, newOpen),
    [filter.columnId, setOpen]
  );

  // Prevent focus outside from closing popover right after programmatic open
  const handleFocusOutside = useCallback(
    (e: Event) => {
      if (!canClose()) {
        e.preventDefault();
      }
    },
    [canClose]
  );

  const columnName = column?.name ?? filter.columnId;
  const operators = getOperatorsForColumnType(column?.column_type);
  const operator = operators.find((o) => o.value === filter.operator);
  const operatorLabel = operator?.label.toLowerCase() ?? filter.operator;
  const needsValue = !NO_VALUE_OPERATORS.includes(filter.operator);

  // Check if filter has a value
  const hasValue = (() => {
    if (NO_VALUE_OPERATORS.includes(filter.operator)) return true;

    if (isSelectType) {
      const selectedIds = (filter.value as string[]) ?? [];

      return selectedIds.length > 0;
    }

    // Checkbox type always has a value selected (true or false)
    if (isCheckboxType) {
      return filter.value !== undefined;
    }

    // For "between" operator, check if both dates are set
    if (isBetweenOperator) {
      const dates = filter.value as string[] | undefined;

      return Boolean(dates?.[0] && dates?.[1]);
    }

    const value = filter.value as string;

    return Boolean(value && value.trim());
  })();

  const handleOperatorChange = (newOperator: FilterOperator) => {
    if (NO_VALUE_OPERATORS.includes(newOperator)) {
      updateFilter(filter.columnId, { operator: newOperator, value: undefined });
    } else if (newOperator === 'between') {
      // Reset to array for between operator
      updateFilter(filter.columnId, { operator: newOperator, value: ['', ''] });
    } else if (filter.operator === 'between') {
      // Switching from between to single value - reset to empty string
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

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFilter(filter.columnId);
  };

  return (
    <div
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-[5px] pr-1.5 text-xs font-medium',
        hasValue
          ? 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30'
          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
      )}
    >
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <span className="font-medium">{columnName}</span>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 p-0"
          align="start"
          alignOffset={-8}
          sideOffset={8}
          onFocusOutside={handleFocusOutside}
        >
          {/* Header with column name and operator dropdown */}
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{columnName}</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-sm outline-none">
                  {operatorLabel}
                  <ChevronDown className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {operators.map((op) => (
                    <DropdownMenuItem
                      key={op.value}
                      onClick={() => handleOperatorChange(op.value)}
                      className={cn(
                        'cursor-pointer',
                        filter.operator === op.value && 'bg-accent'
                      )}
                    >
                      {op.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground cursor-pointer outline-none">
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => {
                    removeFilter(filter.columnId);
                    handleOpenChange(false);
                  }}
                >
                  Delete filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filter value input/options */}
          {needsValue && (
            <div className="p-2">
              {isSelectType ? (
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {column?.options?.map((option) => {
                    const selectedIds = (filter.value as string[]) ?? [];
                    const isSelected = selectedIds.includes(option.id);

                    return (
                      <div
                        key={option.id}
                        className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-2 py-1.5"
                        onClick={() => handleOptionToggle(option.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="pointer-events-none"
                        />
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: option.color
                              ? `${option.color}20`
                              : undefined,
                            color: option.color ?? undefined,
                          }}
                        >
                          {option.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : isCheckboxType ? (
                <div className="space-y-1">
                  {CHECKBOX_VALUES.map((option) => {
                    const isSelected = filter.value === option.value;

                    return (
                      <div
                        key={String(option.value)}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5',
                          isSelected ? 'bg-accent' : 'hover:bg-accent'
                        )}
                        onClick={() => handleCheckboxValueChange(option.value)}
                      >
                        <span className="text-sm">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : isDateType ? (
                isBetweenOperator ? (
                  <FilterDateRangeInput
                    value={(filter.value as string[]) ?? ['', '']}
                    onChange={handleDateRangeChange}
                  />
                ) : (
                  <FilterDateInput
                    value={(filter.value as string) ?? ''}
                    onChange={handleValueChange}
                  />
                )
              ) : isNumberType ? (
                <FilterNumberInput
                  value={(filter.value as string) ?? ''}
                  onChange={handleValueChange}
                />
              ) : (
                <FilterTextInput
                  value={(filter.value as string) ?? ''}
                  onChange={handleValueChange}
                />
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      <X
        className="size-3 cursor-pointer opacity-60 hover:opacity-100"
        onClick={handleRemove}
      />
    </div>
  );
};

export const FilterChips = ({ columns }: FilterChipsProps) => {
  const { columnFilters } = useJobsPreferences();

  if (columnFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {columnFilters.map((filter) => (
        <FilterChip key={filter.columnId} filter={filter} columns={columns} />
      ))}
    </div>
  );
};
