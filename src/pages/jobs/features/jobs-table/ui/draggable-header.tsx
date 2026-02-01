import { useSortable } from '@dnd-kit/sortable';
import { flexRender, type Header } from '@tanstack/react-table';
import { TableHead } from '@/shared/shadcn/components/table';
import { cn } from '@/shared/shadcn/utils/utils';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type DraggableHeaderProps = {
  header: Header<JobApplicationWithStage, unknown>;
};

export const DraggableHeader = ({ header }: DraggableHeaderProps) => {
  const isActionsColumn = header.id === 'actions';

  const {
    listeners,
    transform,
    attributes,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: header.id,
    disabled: isActionsColumn,
  });

  const style = {
    width: header.getSize(),
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  // Actions column - not draggable
  if (isActionsColumn) {
    return (
      <TableHead style={{ width: header.getSize() }}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
    );
  }

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        'hover:bg-muted/50 cursor-grab transition-colors active:cursor-grabbing',
        isDragging && 'bg-muted/50 z-10'
      )}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};
