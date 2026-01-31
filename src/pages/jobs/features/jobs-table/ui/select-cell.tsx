import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/shadcn/components/command';
import { cn } from '@/shared/shadcn/utils/utils';

type SelectOption = {
  id: string;
  value: string;
  color?: string;
};

type SelectCellProps = {
  value: string | null;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
};

export const SelectCell = ({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  className,
}: SelectCellProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId === value ? null : optionId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-8 w-full justify-between px-2 font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2 truncate">
              {selectedOption.color && (
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              {selectedOption.value}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  onSelect={() => handleSelect(option.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.color && (
                    <span
                      className="mr-2 size-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
