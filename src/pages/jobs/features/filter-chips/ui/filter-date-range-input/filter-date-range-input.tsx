import { X } from 'lucide-react';
import { Input } from '@/shared/shadcn/components/input';
import { Calendar } from '@/shared/shadcn/components/calendar';
import { cn } from '@/shared/shadcn/utils/utils';
import { formatForDisplay } from '@/pages/jobs/features/filter-chips/registry/date-utils';
import { useFilterDateRangeInput } from '@/pages/jobs/features/filter-chips/ui/filter-date-range-input/use-filter-date-range-input';

type FilterDateRangeInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const FilterDateRangeInput = ({
  value,
  onChange,
}: FilterDateRangeInputProps) => {
  const {
    startDate,
    endDate,
    startDateObj,
    endDateObj,
    activeField,
    setActiveField,
    setHoveredDate,
    handleCalendarSelect,
    handleClearStart,
    handleClearEnd,
    getDisabledDates,
    getModifiers,
  } = useFilterDateRangeInput({ value, onChange });

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={formatForDisplay(startDate)}
            placeholder="YYYY/MM/DD"
            className={cn(
              'h-8 cursor-pointer pr-8',
              activeField === 'start' && 'ring-ring ring-2'
            )}
            readOnly
            onClick={() => setActiveField('start')}
          />
          {startDate && (
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
            value={formatForDisplay(endDate)}
            placeholder="YYYY/MM/DD"
            className={cn(
              'h-8 cursor-pointer pr-8',
              activeField === 'end' && 'ring-ring ring-2'
            )}
            readOnly
            onClick={() => setActiveField('end')}
          />
          {endDate && (
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
          range_start:
            'bg-primary text-primary-foreground rounded-l-md rounded-r-none',
          range_end:
            'bg-primary text-primary-foreground rounded-r-md rounded-l-none',
          range_middle: 'bg-accent text-accent-foreground rounded-none',
        }}
        className="w-full pt-2"
      />
    </div>
  );
};
