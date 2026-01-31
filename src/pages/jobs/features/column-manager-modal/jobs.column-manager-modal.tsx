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
import { useColumnManagerModal } from '@/pages/jobs/features/column-manager-modal/model/use-column-manager-modal';
import { SystemColumnsInfo } from '@/pages/jobs/features/column-manager-modal/ui/system-columns-info';
import { AddColumnForm } from '@/pages/jobs/features/column-manager-modal/ui/add-column-form';
import { ColumnItem } from '@/pages/jobs/features/column-manager-modal/ui/column-item';
import type { JobsColumnManagerModalProps } from '@/configs/zustand/modals/modals.props';

export const JobsColumnManagerModal = ({
  open,
  onOpenChange,
}: JobsColumnManagerModalProps) => {
  const {
    columns,
    showAddForm,
    newColumn,
    isCreating,
    handleToggleAddForm,
    handleCancelAdd,
    handleNewColumnChange,
    handleAddColumn,
    handleDeleteColumn,
  } = useColumnManagerModal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
          <DialogDescription>
            Add custom fields to track additional data for your job
            applications.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            <SystemColumnsInfo />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">Custom Columns</h4>
                <Button variant="ghost" size="sm" onClick={handleToggleAddForm}>
                  <Plus className="mr-1 size-4" />
                  Add
                </Button>
              </div>

              {showAddForm && (
                <AddColumnForm
                  name={newColumn.name}
                  columnType={newColumn.column_type}
                  isCreating={isCreating}
                  onNameChange={(value) => handleNewColumnChange('name', value)}
                  onTypeChange={(value) =>
                    handleNewColumnChange('column_type', value)
                  }
                  onSubmit={handleAddColumn}
                  onCancel={handleCancelAdd}
                />
              )}

              {columns.length === 0 && !showAddForm ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No custom columns yet
                </p>
              ) : (
                <div className="space-y-1">
                  {columns.map((column) => (
                    <ColumnItem
                      key={column.id}
                      id={column.id}
                      name={column.name}
                      columnType={column.column_type}
                      onDelete={handleDeleteColumn}
                    />
                  ))}
                </div>
              )}
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
