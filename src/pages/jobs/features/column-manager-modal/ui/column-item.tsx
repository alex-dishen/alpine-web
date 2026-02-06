import { GripVertical, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { COLUMN_TYPE_LABELS } from '@/pages/jobs/registry/jobs.constants';
import { useColumnItem } from '@/pages/jobs/features/column-manager-modal/model/use-column-item';
import type { ColumnType } from '@/configs/api/types/api.enums';

type ColumnItemProps = {
  id: string;
  name: string;
  columnType: ColumnType;
  isCore: boolean;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
};

export const ColumnItem = ({
  id,
  name,
  columnType,
  isCore,
  onRename,
  onDelete,
}: ColumnItemProps) => {
  const {
    style,
    isEditing,
    editValue,
    editAreaRef,
    attributes,
    listeners,
    setNodeRef,
    setEditValue,
    handleSave,
    handleCancel,
    startEditing,
  } = useColumnItem({ id, name, isCore, onRename });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background flex items-center justify-between rounded-md border p-2"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-2">
        <GripVertical
          className="text-muted-foreground size-4 shrink-0 cursor-grab"
          {...attributes}
          {...listeners}
        />
        {isEditing ? (
          <div ref={editAreaRef} className="relative min-w-0 flex-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();

                if (e.key === 'Escape') handleCancel();
              }}
              className="h-6 text-sm"
              autoFocus
            />
            <div className="absolute right-0 z-10 mt-1 flex items-center gap-0.5">
              <Button
                variant="outline"
                size="icon"
                className="size-6 cursor-pointer shadow-sm"
                onClick={handleSave}
              >
                <Check className="size-3 text-green-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-6 cursor-pointer shadow-sm"
                onClick={handleCancel}
              >
                <X className="text-muted-foreground size-3" />
              </Button>
            </div>
          </div>
        ) : (
          <span
            className={
              isCore
                ? 'truncate px-2 py-0.5 text-sm'
                : 'hover:bg-muted cursor-pointer truncate rounded px-2 py-0.5 text-sm transition-colors'
            }
            onClick={startEditing}
          >
            {name}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-muted-foreground text-xs">
          {COLUMN_TYPE_LABELS[columnType]}
        </span>
        {!isCore && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 cursor-pointer"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
