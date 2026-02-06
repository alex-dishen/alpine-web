import { ChevronDown, MoreHorizontal, X } from 'lucide-react';
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
import type { ColumnFilter } from '@/configs/zustand/jobs-table/jobs-table.helpers';
import { useFilterChip } from '@/pages/jobs/features/filter-chips/model/use-filter-chip';
import { getFilterValueInput } from '@/pages/jobs/features/filter-chips/registry/filter-value-input.factory';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type FilterChipProps = {
  filter: ColumnFilter;
  columns: JobColumn[];
};

export const FilterChip = ({ filter, columns }: FilterChipProps) => {
  const {
    open,
    column,
    hasValue,
    operators,
    columnType,
    columnName,
    needsValue,
    filterValue,
    operatorLabel,
    filterOperator,
    isBetweenOperator,
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
  } = useFilterChip({ filter, columns });

  return (
    <div
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-[5px] pr-1.5 text-xs font-medium',
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
                        filterOperator === op.value && 'bg-accent'
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
                  className="cursor-pointer"
                  onClick={handleClearValue}
                >
                  Clear filter
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filter value input/options */}
          {needsValue && (
            <div className="p-2">
              {getFilterValueInput(columnType, {
                value: filterValue,
                options: column?.options,
                isBetweenOperator,
                onValueChange: handleValueChange,
                onDateRangeChange: handleDateRangeChange,
                onOptionToggle: handleOptionToggle,
                onCheckboxValueChange: handleCheckboxValueChange,
              })}
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
