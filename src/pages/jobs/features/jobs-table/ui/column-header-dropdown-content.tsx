import { useState } from 'react';
import { ArrowDown, ArrowUp, Filter, Trash2 } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/shadcn/components/dropdown-menu';
import { Input } from '@/shared/shadcn/components/input';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type ColumnHeaderDropdownContentProps = {
  column: JobColumn;
  onSort: (direction: 'asc' | 'desc') => void;
  onFilter: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
};

export const ColumnHeaderDropdownContent = ({
  column,
  onSort,
  onFilter,
  onRename,
  onDelete,
}: ColumnHeaderDropdownContentProps) => {
  const [name, setName] = useState(column.name);

  const handleBlur = () => {
    const trimmedName = name.trim();

    if (trimmedName && trimmedName !== column.name) {
      onRename(trimmedName);
    } else {
      setName(column.name);
    }
  };

  return (
    <DropdownMenuContent
      align="start"
      className="w-48"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {!column.is_core && (
        <>
          <div className="px-2 py-1.5">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
                e.stopPropagation();
              }}
              className="h-8"
              autoFocus
            />
          </div>
          <DropdownMenuSeparator />
        </>
      )}

      <DropdownMenuItem onClick={onFilter} className="cursor-pointer">
        <Filter className="mr-2 size-4" />
        Filter
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSort('asc')}
        className="cursor-pointer"
      >
        <ArrowUp className="mr-2 size-4" />
        Sort ascending
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSort('desc')}
        className="cursor-pointer"
      >
        <ArrowDown className="mr-2 size-4" />
        Sort descending
      </DropdownMenuItem>

      {!column.is_core && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  );
};
