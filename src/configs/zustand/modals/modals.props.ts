export type BaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Shared modals
export type ConfirmModalProps = BaseModalProps & {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
};

// Jobs modals
export type JobsAddModalProps = BaseModalProps;

export type JobsDetailModalProps = BaseModalProps & {
  jobId: string;
};

export type JobsColumnManagerModalProps = BaseModalProps;

export type JobsStageManagerModalProps = BaseModalProps;
