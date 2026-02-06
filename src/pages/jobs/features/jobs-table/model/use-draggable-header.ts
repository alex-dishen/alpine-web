import { useState, useRef, useEffect, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import type { Header } from '@tanstack/react-table';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';
import type { ColumnMeta } from '../registry/jobs-table-columns.factory.types';

export const useDraggableHeader = (
  header: Header<JobApplicationWithStage, unknown>
) => {
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

  const meta = header.column.columnDef.meta as ColumnMeta;
  const { column, icon, callbacks } = meta;

  const hasActiveSort = callbacks.getHasActiveSort(column.id);
  const hasActiveFilter = callbacks.getHasActiveFilter(column.id);

  // Track movement during drag
  useEffect(() => {
    if (isDragging && transform) {
      if (Math.abs(transform.x) > 3 || Math.abs(transform.y) > 3) {
        hadMovementRef.current = true;
      }
    }
  }, [isDragging, transform]);

  const handlePointerDown = () => {
    isPressedRef.current = true;
    hadMovementRef.current = false;
  };

  const handlePointerUp = () => {
    if (isPressedRef.current && !hadMovementRef.current) {
      setDropdownOpen(true);
    }
    isPressedRef.current = false;
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDropdownOpen(false);
    }
  };

  const handleSort = useCallback(
    (direction: 'asc' | 'desc') => {
      callbacks.onSort(column.id, column.name, direction);
      setDropdownOpen(false);
    },
    [callbacks, column.id, column.name]
  );

  const handleFilter = useCallback(() => {
    callbacks.onFilter(column.id);
    setDropdownOpen(false);
  }, [callbacks, column.id]);

  const handleRename = useCallback(
    (newName: string) => {
      callbacks.onRenameColumn(column.id, newName);
      setDropdownOpen(false);
    },
    [callbacks, column.id]
  );

  const handleDelete = useCallback(() => {
    callbacks.onDeleteColumn(column.id);
    setDropdownOpen(false);
  }, [callbacks, column.id]);

  const style = {
    width: header.getSize(),
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return {
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
  };
};
