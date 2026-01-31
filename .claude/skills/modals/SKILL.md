---
name: modals
description: Create and manage modal windows in alpine-web. Use when creating a new modal, adding a dialog, sheet, or popup component that uses the centralized modal system. Triggers include "create modal", "add modal", "new dialog", "add dialog", "modal window", or when working with files in configs/zustand/modals/.
---

# Modals

Centralized modal system using Zustand. Modals are opened via `openModal()` and rendered by `ModalsProvider`.

## Modal System Files

```
src/configs/zustand/modals/
├── modals.props.ts      # All modal props (single source of truth)
├── modals.registry.ts   # MODALS const, ModalPropsMap, modalComponents
└── modals.store.ts      # Zustand store (openModal, closeModal)
```

## Modal Component Structure

Each modal follows the standard feature pattern:

```
[modal-name]-modal/
├── jobs.[modal-name]-modal.tsx   # Pure UI component
└── model/
    ├── use-[modal-name]-modal.ts # Main hook (form state, validation, handlers)
    └── use-[action].ts           # Individual API hooks
```

**Example:**

```
add-modal/
├── jobs.add-modal.tsx      # Pure UI, uses useAddModal hook
└── model/
    ├── use-add-modal.ts    # Form state, validation, submit handler
    └── use-create-job.ts   # API mutation for creating a job
```

## Adding a New Modal

### 1. Create modal folder structure

```
src/pages/[domain]/features/[name]-modal/
├── [domain].[name]-modal.tsx
└── model/
    ├── use-[name]-modal.ts
    └── use-[action].ts (if needed)
```

### 2. Define props in `modals.props.ts`

```tsx
export type MyNewModalProps = BaseModalProps & {
  itemId: string; // Extra props specific to this modal
};

// For modals with no extra props:
export type SimpleModalProps = BaseModalProps;
```

### 3. Register in `modals.registry.ts`

```tsx
import { MyNewModal } from '@/pages/example/features/my-new-modal/my-new-modal';
import type { MyNewModalProps } from '@/configs/zustand/modals/modals.props';

export const MODALS = {
  // ... existing
  MyNewModal: 'MyNewModal',
} as const;

export type ModalPropsMap = {
  // ... existing
  [MODALS.MyNewModal]: MyNewModalProps;
};

export const modalComponents: ModalComponents = {
  // ... existing
  [MODALS.MyNewModal]: MyNewModal,
};
```

### 4. Create the main hook

```tsx
// use-my-new-modal.ts
import { useState } from 'react';
import { useCreateItem } from '@/pages/example/features/my-new-modal/model/use-create-item';

type UseMyNewModalProps = {
  onOpenChange: (open: boolean) => void;
};

export const useMyNewModal = ({ onOpenChange }: UseMyNewModalProps) => {
  const createItem = useCreateItem();
  const [formData, setFormData] = useState({...});

  const handleSubmit = () => {
    createItem.mutate(
      {
        body: {
          id: crypto.randomUUID(),  // Generate ID at call site
          ...formData,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return { formData, setFormData, handleSubmit, isPending: createItem.isPending };
};
```

### 5. Create the modal component

```tsx
// my-new-modal.tsx
import { useMyNewModal } from '@/pages/example/features/my-new-modal/model/use-my-new-modal';
import type { MyNewModalProps } from '@/configs/zustand/modals/modals.props';

export const MyNewModal = ({ open, onOpenChange, itemId }: MyNewModalProps) => {
  const { formData, handleSubmit, isPending } = useMyNewModal({ onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{/* Pure UI rendering */}</DialogContent>
    </Dialog>
  );
};
```

## Opening Modals

```tsx
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.registry';

const Component = () => {
  const openModal = useModalsStore((state) => state.openModal);

  // With extra props
  const handleOpen = () => openModal(MODALS.MyNewModal, { itemId: '123' });

  // Without extra props (pass empty object)
  const handleOpenSimple = () => openModal(MODALS.SimpleModal, {});
};
```

## Critical Rules

| Rule                                       | Reason                                                        |
| ------------------------------------------ | ------------------------------------------------------------- |
| Props in `modals.props.ts` only            | Single source of truth, avoids circular deps                  |
| Modals import props from `modals.props.ts` | Registry imports modals, so modals can't import from registry |
| `open` and `onOpenChange` required         | Provider always passes them                                   |
| Pass `{}` for no extra props               | Type system requires the argument                             |
| Logic in hook, not component               | Component stays pure UI                                       |
| One hook per file                          | Consistent with feature pattern                               |

## Common Mistakes

| Wrong                            | Correct                             |
| -------------------------------- | ----------------------------------- |
| Define props in modal file       | Define in `modals.props.ts`         |
| Import MODALS in modal component | Only import props type              |
| Logic inside modal component     | Move to `use-[modal]-modal.ts` hook |
| Multiple hooks in one file       | One hook per file                   |
| `open?: boolean` with default    | `open: boolean` (required)          |
| `openModal(MODALS.X)`            | `openModal(MODALS.X, {})`           |
