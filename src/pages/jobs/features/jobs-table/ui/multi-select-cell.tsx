import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Badge } from '@/shared/shadcn/components/badge';
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

type MultiSelectCellProps = {
  values: string[];
  options: SelectOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
};

export const MultiSelectCell = ({
  values,
  options,
  onChange,
  placeholder = 'Select...',
  className,
}: MultiSelectCellProps) => {
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const selectedOptions = options.filter((opt) => localValues.includes(opt.id));

  const handleSelect = (optionId: string) => {
    const newValues = localValues.includes(optionId)
      ? localValues.filter((v) => v !== optionId)
      : [...localValues, optionId];
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleRemove = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    const newValues = localValues.filter((v) => v !== optionId);
    setLocalValues(newValues);
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-auto min-h-[32px] w-full cursor-pointer justify-between rounded-none px-2 font-normal',
            !localValues.length && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex flex-wrap gap-1">
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                    style={
                      option.color
                        ? {
                            backgroundColor: `${option.color}20`,
                            color: option.color,
                          }
                        : undefined
                    }
                  >
                    {option.value}
                    <X
                      className="size-3 cursor-pointer hover:opacity-70"
                      onClick={(e) => handleRemove(e, option.id)}
                    />
                  </Badge>
                ))
              : placeholder}
          </span>
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
                      localValues.includes(option.id)
                        ? 'opacity-100'
                        : 'opacity-0'
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
