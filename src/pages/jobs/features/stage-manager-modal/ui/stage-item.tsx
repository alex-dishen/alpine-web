import { GripVertical, Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { ColorPicker } from '@/pages/jobs/features/stage-manager-modal/ui/color-picker';

type StageItemProps = {
  id: string;
  name: string;
  color: string;
  isEditing: boolean;
  editName: string;
  editColor: string;
  onStartEdit: () => void;
  onEditNameChange: (value: string) => void;
  onEditColorChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

export const StageItem = ({
  name,
  color,
  isEditing,
  editName,
  editColor,
  onStartEdit,
  onEditNameChange,
  onEditColorChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: StageItemProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="flex flex-1 items-center gap-2">
          <ColorPicker value={editColor} onChange={onEditColorChange} compact />
          <Input
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className="h-8"
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onSaveEdit}
          >
            <Check className="size-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onCancelEdit}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border p-2">
      <div className="flex items-center gap-2">
        <GripVertical className="text-muted-foreground size-4 cursor-grab" />
        <span
          className="size-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onStartEdit}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onDelete}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      </div>
    </div>
  );
};
