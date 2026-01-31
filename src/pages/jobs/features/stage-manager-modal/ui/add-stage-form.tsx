import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Label } from '@/shared/shadcn/components/label';
import { ColorPicker } from '@/pages/jobs/features/stage-manager-modal/ui/color-picker';

type AddStageFormProps = {
  name: string;
  color: string;
  isCreating: boolean;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const AddStageForm = ({
  name,
  color,
  isCreating,
  onNameChange,
  onColorChange,
  onSubmit,
  onCancel,
}: AddStageFormProps) => {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="space-y-2">
        <Label htmlFor="stage-name">Stage Name</Label>
        <Input
          id="stage-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Technical Interview"
        />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <ColorPicker value={color} onChange={onColorChange} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSubmit} disabled={isCreating}>
          Add Stage
        </Button>
      </div>
    </div>
  );
};
