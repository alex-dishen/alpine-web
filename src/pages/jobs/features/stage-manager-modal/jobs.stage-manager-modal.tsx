import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/dialog';
import { Button } from '@/shared/shadcn/components/button';
import { ScrollArea } from '@/shared/shadcn/components/scroll-area';
import { useStageManagerModal } from '@/pages/jobs/features/stage-manager-modal/model/use-stage-manager-modal';
import { AddStageForm } from '@/pages/jobs/features/stage-manager-modal/ui/add-stage-form';
import { StageItem } from '@/pages/jobs/features/stage-manager-modal/ui/stage-item';
import type { JobsStageManagerModalProps } from '@/configs/zustand/modals/modals.props';

export const JobsStageManagerModal = ({
  open,
  onOpenChange,
}: JobsStageManagerModalProps) => {
  const {
    stages,
    showAddForm,
    newStage,
    editingId,
    editValue,
    isCreating,
    handleShowAddForm,
    handleCancelAdd,
    handleNewStageChange,
    handleAddStage,
    handleStartEdit,
    handleEditValueChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteStage,
  } = useStageManagerModal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Stages</DialogTitle>
          <DialogDescription>
            Customize the stages in your job application pipeline.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {!showAddForm ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShowAddForm}
              >
                <Plus className="mr-2 size-4" />
                Add New Stage
              </Button>
            ) : (
              <AddStageForm
                name={newStage.name}
                color={newStage.color}
                isCreating={isCreating}
                onNameChange={(value) => handleNewStageChange('name', value)}
                onColorChange={(value) => handleNewStageChange('color', value)}
                onSubmit={handleAddStage}
                onCancel={handleCancelAdd}
              />
            )}

            <div className="space-y-1">
              {stages.map((stage) => (
                <StageItem
                  key={stage.id}
                  id={stage.id}
                  name={stage.name}
                  color={stage.color}
                  isEditing={editingId === stage.id}
                  editName={editValue.name}
                  editColor={editValue.color}
                  onStartEdit={() => handleStartEdit(stage)}
                  onEditNameChange={(value) =>
                    handleEditValueChange('name', value)
                  }
                  onEditColorChange={(value) =>
                    handleEditValueChange('color', value)
                  }
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={() => handleDeleteStage(stage.id)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
