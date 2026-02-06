import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/shared/shadcn/components/button';
import { Calendar } from '@/shared/shadcn/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import { cn } from '@/shared/shadcn/utils/utils';

type DateCellProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
};

export const DateCell = ({
  value,
  onChange,
  placeholder = 'Select date',
  className,
}: DateCellProps) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const date = localValue ? new Date(localValue) : undefined;

  const handleSelect = (newDate: Date | undefined) => {
    const newValue = newDate ? newDate.toISOString() : null;
    setLocalValue(newValue);
    onChange(newValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalValue(null);
    onChange(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'min-h-[32px] w-full cursor-pointer justify-start rounded-none px-2 font-normal',
            !localValue && 'text-muted-foreground',
            className
          )}
        >
          {date ? format(date, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        {localValue && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
