import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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
import type { JobStage } from '@/pages/jobs/registry/jobs.types';

type StageCellProps = {
  value: string;
  stage?: JobStage;
  stages: JobStage[];
  onChange: (stageId: string) => void;
  className?: string;
};

export const StageCell = ({
  value,
  stage,
  stages,
  onChange,
  className,
}: StageCellProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (stageId: string) => {
    onChange(stageId);
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
            className
          )}
        >
          {stage ? (
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${stage.color}20`,
                color: stage.color,
                borderColor: stage.color,
              }}
              className="border"
            >
              {stage.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">Select stage...</span>
          )}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search stages..." />
          <CommandList>
            <CommandEmpty>No stages found.</CommandEmpty>
            <CommandGroup>
              {stages.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.name}
                  onSelect={() => handleSelect(s.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === s.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span
                    className="mr-2 size-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
