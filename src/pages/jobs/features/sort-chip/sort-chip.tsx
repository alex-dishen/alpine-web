import { ArrowUpDown, ChevronDown, X } from 'lucide-react';
import { Badge } from '@/shared/shadcn/components/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import { cn } from '@/shared/shadcn/utils/utils';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';
import { useSortChip } from '@/pages/jobs/features/sort-chip/model/use-sort-chip';

type SortChipProps = {
  columns: JobColumn[];
};

export const SortChip = ({ columns }: SortChipProps) => {
  const {
    open,
    sort,
    columns: allColumns,
    setOpen,
    handleClearSort,
    handleUpdateSort,
  } = useSortChip({ columns });

  const hasSort = sort !== null;
  const directionLabel = sort?.direction === 'asc' ? 'ascending' : 'descending';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          className={cn(
            'h-[26px] cursor-pointer gap-1.5 rounded-md px-2',
            hasSort
              ? 'bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          )}
        >
          <ArrowUpDown className="size-3" />
          Sort
          <ChevronDown className="size-3" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Header */}
        <div className="flex items-center border-b px-3 py-2">
          <div className="flex items-center gap-1">
            {hasSort ? (
              <>
                <span className="text-sm font-medium">{sort.columnName}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-sm outline-none">
                    {directionLabel}
                    <ChevronDown className="size-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleUpdateSort('direction', 'asc')}
                    >
                      Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleUpdateSort('direction', 'desc')}
                    >
                      Descending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">
                No sort applied
              </span>
            )}
          </div>
        </div>

        {/* Column selector */}
        <div className="p-2">
          <Select
            value={sort?.columnId ?? ''}
            onValueChange={(value) => handleUpdateSort('columnId', value)}
          >
            <SelectTrigger size="sm" className="w-full cursor-pointer">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {allColumns.map((column) => (
                <SelectItem
                  key={column.id}
                  value={column.id}
                  className="cursor-pointer"
                >
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear sort button */}
        {hasSort && (
          <div className="px-2 pb-2">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
              onClick={handleClearSort}
            >
              <X className="size-4" />
              Clear sort
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
