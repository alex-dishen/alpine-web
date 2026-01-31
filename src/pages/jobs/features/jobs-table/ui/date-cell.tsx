import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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

  const date = value ? new Date(value) : undefined;

  const handleSelect = (newDate: Date | undefined) => {
    onChange(newDate ? newDate.toISOString() : null);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-8 w-full justify-start px-2 font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
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
        {value && (
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
