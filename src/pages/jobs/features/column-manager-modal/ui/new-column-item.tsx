import { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, Check, X } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import { COLUMN_TYPE_LABELS } from '@/pages/jobs/registry/jobs.constants';
import { getIconForColumnType } from '@/pages/jobs/features/jobs-table/registry/jobs-table-columns.helper';
import type { ColumnType } from '@/configs/api/types/api.enums';

type NewColumnItemProps = {
  name: string;
  columnType: ColumnType;
  isCreating: boolean;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const NewColumnItem = ({
  name,
  columnType,
  isCreating,
  onNameChange,
  onTypeChange,
  onSubmit,
  onCancel,
}: NewColumnItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (selectOpen) return;

      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        onCancel();
      }
    },
    [onCancel, selectOpen]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div
      ref={itemRef}
      className="bg-background mt-1 flex items-center justify-between rounded-md border border-dashed p-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <GripVertical className="text-muted-foreground/30 size-4 shrink-0" />
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();

            if (e.key === 'Escape') onCancel();
          }}
          placeholder="Column name..."
          className="h-6 rounded-sm text-sm"
          autoFocus
        />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pl-2">
        <Select
          value={columnType}
          onValueChange={onTypeChange}
          open={selectOpen}
          onOpenChange={setSelectOpen}
        >
          <SelectTrigger
            size="sm"
            className="!h-6 w-24 cursor-pointer rounded-sm py-0 text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(COLUMN_TYPE_LABELS) as [ColumnType, string][]).map(
              ([value, label]) => {
                const Icon = getIconForColumnType(value);

                return (
                  <SelectItem
                    key={value}
                    value={value}
                    className="cursor-pointer"
                  >
                    <Icon className="text-muted-foreground size-3.5" />
                    {label}
                  </SelectItem>
                );
              }
            )}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="size-6 cursor-pointer shadow-sm"
          onClick={onSubmit}
          disabled={isCreating || !name.trim()}
        >
          <Check className="size-3 text-green-500" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-6 cursor-pointer shadow-sm"
          onClick={onCancel}
        >
          <X className="text-muted-foreground size-3" />
        </Button>
      </div>
    </div>
  );
};
