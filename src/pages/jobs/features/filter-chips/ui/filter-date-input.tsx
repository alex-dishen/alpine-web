import { X } from 'lucide-react';
import { Input } from '@/shared/shadcn/components/input';
import { Calendar } from '@/shared/shadcn/components/calendar';
import {
  parseDate,
  formatForDisplay,
  formatToISO,
} from '@/pages/jobs/features/filter-chips/registry/date-utils';

type FilterDateInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const FilterDateInput = ({ value, onChange }: FilterDateInputProps) => {
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(formatToISO(date));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div>
      <div className="relative">
        <Input
          value={formatForDisplay(value)}
          placeholder="YYYY/MM/DD"
          className="h-8 cursor-pointer pr-8"
          readOnly
        />
        {value && (
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
        selected={parseDate(value)}
        onSelect={handleCalendarSelect}
        className="w-full pt-2"
      />
    </div>
  );
};
