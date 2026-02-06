import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { COLUMN_TYPE_LABELS } from '@/pages/jobs/registry/jobs.constants';
import type { ColumnType } from '@/configs/api/types/api.enums';

type ColumnItemProps = {
  id: string;
  name: string;
  columnType: ColumnType;
  onDelete: (id: string) => void;
};

export const ColumnItem = ({
  id,
  name,
  columnType,
  onDelete,
}: ColumnItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-md border p-2">
      <div className="flex items-center gap-2">
        <GripVertical className="text-muted-foreground size-4 cursor-grab" />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">
          {COLUMN_TYPE_LABELS[columnType]}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      </div>
    </div>
  );
};
