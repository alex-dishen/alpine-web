import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Label } from '@/shared/shadcn/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import { COLUMN_TYPE_LABELS } from '@/pages/jobs/registry/jobs.constants';
import type { ColumnType } from '@/configs/api/types/api.enums';

type AddColumnFormProps = {
  name: string;
  columnType: ColumnType;
  isCreating: boolean;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const AddColumnForm = ({
  name,
  columnType,
  isCreating,
  onNameChange,
  onTypeChange,
  onSubmit,
  onCancel,
}: AddColumnFormProps) => {
  return (
    <div className="mb-3 space-y-3 rounded-md border p-3">
      <div className="space-y-2">
        <Label htmlFor="column-name">Column Name</Label>
        <Input
          id="column-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Recruiter Name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="column-type">Type</Label>
        <Select value={columnType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(COLUMN_TYPE_LABELS) as [ColumnType, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSubmit} disabled={isCreating}>
          Add Column
        </Button>
      </div>
    </div>
  );
};
