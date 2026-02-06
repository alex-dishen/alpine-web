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
    header: headerInstance,
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
            'group/header hover:bg-muted/50 relative cursor-pointer rounded-t-sm transition-colors outline-none',
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
          <div
            onMouseDown={headerInstance.getResizeHandler()}
            onTouchStart={headerInstance.getResizeHandler()}
            onDoubleClick={() => headerInstance.column.resetSize()}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              'group/resize absolute top-0 right-0 flex h-full w-2 cursor-col-resize touch-none items-center select-none',
              'opacity-0 hover:opacity-100',
              headerInstance.column.getIsResizing() && 'opacity-100'
            )}
          >
            <div
              className={cn(
                'bg-border group-hover/resize:bg-primary ml-auto h-3/5 w-px rounded-full group-hover/resize:w-0.5',
                headerInstance.column.getIsResizing() && 'bg-primary w-0.5'
              )}
            />
          </div>
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
