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
import { SortChip } from '@/pages/jobs/features/sort-chip/sort-chip';
import { FilterChips } from '@/pages/jobs/features/filter-chips/filter-chips';
import { useTableToolbar } from '@/pages/jobs/features/table-toolbar/use-table-toolbar';

export const TableToolbar = () => {
  const {
    columns,
    availableColumns,
    hasActiveSortOrFilters,
    handleAddFilter,
    clearAll,
  } = useTableToolbar();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SortChip columns={columns} />
      <FilterChips columns={columns} />

      {hasActiveSortOrFilters && (
        <span className="text-muted-foreground">|</span>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="border-muted-foreground/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-2 py-1 text-xs"
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
                {availableColumns.map((column) => (
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

      {hasActiveSortOrFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
