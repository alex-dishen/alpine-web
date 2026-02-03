import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { SortChips } from '@/pages/jobs/features/jobs-table/ui/sort-chips';
import { FilterChips } from '@/pages/jobs/features/jobs-table/ui/filter-chips';
import { useJobsPreferences } from '@/features/preferences/model/use-jobs-preferences';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type TableToolbarProps = {
  columns: JobColumn[];
};

export const TableToolbar = ({ columns }: TableToolbarProps) => {
  const [addFilterOpen, setAddFilterOpen] = useState(false);

  const { sorts, columnFilters, addFilter, clearAll } = useJobsPreferences();

  const hasActiveSortsOrFilters = sorts.length > 0 || columnFilters.length > 0;

  const handleAddFilter = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    const columnType = column?.column_type;

    // Default operator and value based on column type
    let defaultOperator: string;
    let defaultValue: unknown;

    switch (columnType) {
      case 'select':
      case 'multi_select':
        defaultOperator = 'is_any_of';
        defaultValue = [];
        break;
      case 'date':
        defaultOperator = 'gte';
        defaultValue = '';
        break;
      case 'number':
        defaultOperator = 'equals';
        defaultValue = '';
        break;
      case 'checkbox':
        defaultOperator = 'equals';
        defaultValue = undefined; // No default - user must select
        break;
      default:
        defaultOperator = 'contains';
        defaultValue = '';
    }

    addFilter(columnId, defaultOperator, defaultValue);
    setAddFilterOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SortChips columns={columns} />
      <FilterChips columns={columns} />

      {hasActiveSortsOrFilters && (
        <span className="text-muted-foreground">|</span>
      )}

      <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-muted-foreground/50 px-2 py-1 text-xs text-muted-foreground hover:border-foreground/50 hover:text-foreground"
          >
            <Plus className="size-3" />
            Filter
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search columns..." />
            <CommandList>
              <CommandEmpty>No columns found.</CommandEmpty>
              <CommandGroup>
                {columns.map((column) => (
                  <CommandItem
                    key={column.id}
                    value={column.name}
                    onSelect={() => handleAddFilter(column.id)}
                    className="cursor-pointer"
                  >
                    {column.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasActiveSortsOrFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
