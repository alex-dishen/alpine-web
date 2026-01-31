import { Check, ChevronDown, X } from 'lucide-react';
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
import { useFilterBar } from '@/pages/jobs/features/filter-bar/model/use-filter-bar';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

type JobsFilterBarProps = {
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
};

export const JobsFilterBar = ({ filters, setFilters }: JobsFilterBarProps) => {
  const {
    stages,
    stageFilter,
    selectedStages,
    handleStageToggle,
    handleRemoveStage,
    handleClearAll,
  } = useFilterBar({ filters, setFilters });

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            Stages
            <ChevronDown className="ml-2 size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search stages..." />
            <CommandList>
              <CommandEmpty>No stages found.</CommandEmpty>
              <CommandGroup>
                {stages.map((stage) => (
                  <CommandItem
                    key={stage.id}
                    value={stage.name}
                    onSelect={() => handleStageToggle(stage.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        stageFilter.includes(stage.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span
                      className="mr-2 size-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedStages.map((stage) => (
        <Badge
          key={stage.id}
          variant="secondary"
          className="gap-1 pr-1"
          style={{
            backgroundColor: `${stage.color}20`,
            color: stage.color,
          }}
        >
          {stage.name}
          <X
            className="size-3 cursor-pointer hover:opacity-70"
            onClick={() => handleRemoveStage(stage.id)}
          />
        </Badge>
      ))}

      {stageFilter.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  );
};
