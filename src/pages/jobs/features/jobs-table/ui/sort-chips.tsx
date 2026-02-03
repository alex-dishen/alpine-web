import { useState } from 'react';
import { ArrowUpDown, ChevronDown, GripVertical, Plus, Trash2, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/shared/shadcn/components/button';
import { Badge } from '@/shared/shadcn/components/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';
import { useJobsPreferences, type PreferencesSort } from '@/features/preferences/model/use-jobs-preferences';

type SortItemProps = {
  id: string;
  sort: PreferencesSort;
  availableColumns: JobColumn[];
  onUpdate: (field: 'columnId' | 'direction', value: string) => void;
  onRemove: () => void;
};

const SortItem = ({
  id,
  sort,
  availableColumns,
  onUpdate,
  onRemove,
}: SortItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2"
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground outline-none hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <Select
        value={sort.columnId}
        onValueChange={(value) => onUpdate('columnId', value)}
      >
        <SelectTrigger size="sm" className="flex-1 cursor-pointer">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {availableColumns.map((column) => (
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

      <Select
        value={sort.direction}
        onValueChange={(value) => onUpdate('direction', value)}
      >
        <SelectTrigger size="sm" className="w-24 cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc" className="cursor-pointer">
            Asc
          </SelectItem>
          <SelectItem value="desc" className="cursor-pointer">
            Desc
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon-xs"
        className="cursor-pointer"
        onClick={onRemove}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};

type SortChipsProps = {
  columns: JobColumn[];
};

export const SortChips = ({ columns }: SortChipsProps) => {
  const [open, setOpen] = useState(false);

  const { sorts, setSorts, clearSorts } = useJobsPreferences();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (sorts.length === 0) {
    return null;
  }

  const handleRemoveSort = (index: number) => {
    const newSorts = sorts.filter((_, i) => i !== index);
    setSorts(newSorts);
  };

  const handleUpdateSort = (
    index: number,
    field: 'columnId' | 'direction',
    value: string
  ) => {
    const newSorts = sorts.map((sort, i) => {
      if (i !== index) return sort;
      return { ...sort, [field]: value };
    });
    setSorts(newSorts);
  };

  const handleAddSort = () => {
    const usedColumnIds = new Set(sorts.map((s) => s.columnId));
    const availableColumn = columns.find((c) => !usedColumnIds.has(c.id));
    if (availableColumn) {
      setSorts([
        ...sorts,
        { columnId: availableColumn.id, direction: 'asc' },
      ]);
    }
  };

  const handleDeleteSort = () => {
    clearSorts();
    setOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sorts.findIndex((s) => s.columnId === active.id);
      const newIndex = sorts.findIndex((s) => s.columnId === over.id);
      setSorts(arrayMove(sorts, oldIndex, newIndex));
    }
  };

  const availableColumnsForSort = (currentColumnId: string) => {
    const usedColumnIds = new Set(
      sorts.filter((s) => s.columnId !== currentColumnId).map((s) => s.columnId)
    );
    return columns.filter((c) => !usedColumnIds.has(c.id));
  };

  const canAddSort = sorts.length < columns.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge className="cursor-pointer gap-1.5 bg-blue-500/15 px-2 py-[5px] text-blue-600 hover:bg-blue-500/25 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
          <ArrowUpDown className="size-3" />
          {sorts.length} {sorts.length === 1 ? 'sort' : 'sorts'}
          <ChevronDown className="size-3" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sorts.map((s) => s.columnId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sorts.map((sort, index) => (
                  <SortItem
                    key={sort.columnId}
                    id={sort.columnId}
                    sort={sort}
                    availableColumns={availableColumnsForSort(sort.columnId)}
                    onUpdate={(field, value) =>
                      handleUpdateSort(index, field, value)
                    }
                    onRemove={() => handleRemoveSort(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex items-center gap-2">
            {canAddSort && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 cursor-pointer justify-start gap-2 text-muted-foreground"
                onClick={handleAddSort}
              >
                <Plus className="size-4" />
                Add sort
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDeleteSort}
            >
              <Trash2 className="size-4" />
              Delete sort
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
