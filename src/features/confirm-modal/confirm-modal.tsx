import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/dialog';
import { Button } from '@/shared/shadcn/components/button';
import type { ConfirmModalProps } from '@/configs/zustand/modals/modals.props';

export const ConfirmModal = ({
  open,
  title,
  description,
  variant = 'default',
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onConfirm,
  onOpenChange,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'outline' : 'default'}
            className={
              variant === 'destructive'
                ? 'text-destructive hover:!bg-destructive/20 hover:!text-destructive cursor-pointer'
                : 'cursor-pointer'
            }
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
