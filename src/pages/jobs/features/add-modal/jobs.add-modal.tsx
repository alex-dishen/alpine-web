import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/dialog';
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
import { useAddModal } from '@/pages/jobs/features/add-modal/model/use-add-modal';
import type { JobsAddModalProps } from '@/configs/zustand/modals/modals.props';

export const JobsAddModal = ({ open, onOpenChange }: JobsAddModalProps) => {
  const {
    formData,
    errors,
    stages,
    selectedStage,
    isLoadingStages,
    isPending,
    isSubmitDisabled,
    handleChange,
    handleSubmit,
    handleOpenChange,
    handleCancel,
  } = useAddModal({ onOpenChange });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Add a new job application to track. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="e.g., Google"
              />
              {errors.company_name && (
                <p className="text-destructive text-sm">
                  {errors.company_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
                placeholder="e.g., Software Engineer"
              />
              {errors.job_title && (
                <p className="text-destructive text-sm">{errors.job_title}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Stage *</Label>
            <Select
              value={formData.stage_id}
              onValueChange={(value) => handleChange('stage_id', value)}
              disabled={isLoadingStages || stages.length === 0}
            >
              <SelectTrigger>
                {isLoadingStages ? (
                  <span className="text-muted-foreground pointer-events-none">
                    Loading stages...
                  </span>
                ) : selectedStage ? (
                  <span className="pointer-events-none flex items-center gap-2">
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: selectedStage.color }}
                    />
                    <span>{selectedStage.name}</span>
                  </span>
                ) : (
                  <SelectValue
                    placeholder={
                      stages.length === 0
                        ? 'No stages available'
                        : 'Select a stage'
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stage_id && (
              <p className="text-destructive text-sm">{errors.stage_id}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isPending ? 'Adding...' : 'Add Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
