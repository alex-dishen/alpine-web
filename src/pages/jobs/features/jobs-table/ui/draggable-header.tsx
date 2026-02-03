import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { type Header } from '@tanstack/react-table';
import { TableHead } from '@/shared/shadcn/components/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/dropdown-menu';
import { cn } from '@/shared/shadcn/utils/utils';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
import type { ColumnMeta } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.factory';
import {
  ColumnHeaderDropdownContent,
  ColumnHeaderDisplay,
} from './column-header-dropdown';

type DraggableHeaderProps = {
  header: Header<JobApplicationWithStage, unknown>;
};

export const DraggableHeader = ({ header }: DraggableHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hadMovementRef = useRef(false);
  const isPressedRef = useRef(false);

  const {
    listeners,
    transform,
    attributes,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: header.id,
  });

  const meta = header.column.columnDef.meta as ColumnMeta | undefined;

  // Track movement during drag
  useEffect(() => {
    if (isDragging && transform) {
      // Consider it "moved" if dragged more than 3px in any direction
      if (Math.abs(transform.x) > 3 || Math.abs(transform.y) > 3) {
        hadMovementRef.current = true;
      }
    }
  }, [isDragging, transform]);

  // Reset movement tracking when pointer goes down
  const handlePointerDown = () => {
    isPressedRef.current = true;
    hadMovementRef.current = false;
  };

  // Open dropdown on pointer up only if no movement happened
  const handlePointerUp = () => {
    if (isPressedRef.current && !hadMovementRef.current && meta?.callbacks) {
      setDropdownOpen(true);
    }
    isPressedRef.current = false;
  };

  // Only allow closing via onOpenChange, opening is controlled by pointerUp
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDropdownOpen(false);
    }
  };

  const style = {
    width: header.getSize(),
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  // If no meta/callbacks, render simple header without dropdown
  if (!meta?.callbacks) {
    return (
      <TableHead
        ref={setNodeRef}
        style={style}
        className={cn(
          'hover:bg-muted/50 rounded-t-sm cursor-grab transition-colors active:cursor-grabbing',
          isDragging && 'bg-muted/50 z-10'
        )}
        {...attributes}
        {...listeners}
      >
        {header.isPlaceholder ? null : (
          <ColumnHeaderDisplay
            icon={meta?.icon ?? (() => null)}
            name={meta?.column.name ?? ''}
            hasActiveIndicator={false}
          />
        )}
      </TableHead>
    );
  }

  const { column, icon, callbacks } = meta;
  const hasActiveSort = callbacks.getHasActiveSort(column.id);
  const hasActiveFilter = callbacks.getHasActiveFilter(column.id);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <TableHead
          ref={setNodeRef}
          style={style}
          className={cn(
            'hover:bg-muted/50 rounded-t-sm cursor-pointer transition-colors outline-none',
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
              hasActiveIndicator={hasActiveSort || hasActiveFilter}
            />
          )}
        </TableHead>
      </DropdownMenuTrigger>
      <ColumnHeaderDropdownContent
        column={column}
        onSort={(direction) => {
          callbacks.onSort(column.id, direction);
          setDropdownOpen(false);
        }}
        onFilter={() => {
          callbacks.onFilter(column.id);
          setDropdownOpen(false);
        }}
        onRename={(newName) => {
          callbacks.onRenameColumn(column.id, newName);
          setDropdownOpen(false);
        }}
        onDelete={() => {
          callbacks.onDeleteColumn(column.id);
          setDropdownOpen(false);
        }}
      />
    </DropdownMenu>
  );
};
