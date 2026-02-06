import type { Header } from '@tanstack/react-table';
import { TableHead } from '@/shared/shadcn/components/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import { cn } from '@/shared/shadcn/utils/utils';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
import { useDraggableHeader } from '@/pages/jobs/features/jobs-table/model/use-draggable-header';
import { ColumnHeaderDropdownContent } from './column-header-dropdown-content';
import { ColumnHeaderDisplay } from './column-header-display';

type DraggableHeaderProps = {
  header: Header<JobApplicationWithStage, unknown>;
};

export const DraggableHeader = ({ header }: DraggableHeaderProps) => {
  const {
    icon,
    style,
    column,
    listeners,
    attributes,
    isDragging,
    dropdownOpen,
    hasActiveSort,
    hasActiveFilter,
    setNodeRef,
    handleSort,
    handleFilter,
    handleRename,
    handleDelete,
    handlePointerUp,
    handleOpenChange,
    handlePointerDown,
  } = useDraggableHeader(header);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <TableHead
          ref={setNodeRef}
          style={style}
          className={cn(
            'hover:bg-muted/50 cursor-pointer rounded-t-sm transition-colors outline-none',
            isDragging && 'bg-muted/50 z-10 cursor-grabbing'
          )}
          onPointerDown={(e) => {
            handlePointerDown();
            listeners?.onPointerDown?.(e);
          }}
          onPointerUp={handlePointerUp}
          {...attributes}
        >
          {header.isPlaceholder ? null : (
            <ColumnHeaderDisplay
              icon={icon}
              name={column.name}
              hasFilterIndicator={hasActiveFilter}
              hasSortIndicator={hasActiveSort}
            />
          )}
        </TableHead>
      </DropdownMenuTrigger>
      <ColumnHeaderDropdownContent
        column={column}
        onSort={handleSort}
        onFilter={handleFilter}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </DropdownMenu>
  );
};
