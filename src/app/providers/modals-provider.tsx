import type { ComponentType } from 'react';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { modalComponents } from '@/configs/zustand/modals/modals.registry';

type ModalComponentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  [key: string]: unknown;
};

export const ModalsProvider = () => {
  const modals = useModalsStore((state) => state.modals);
  const closeModal = useModalsStore((state) => state.closeModal);

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => {
        const Component = modalComponents[
          modal.id
        ] as ComponentType<ModalComponentProps>;

        return (
          <Component
            key={modal.id}
            {...modal.props}
            open={true}
            onOpenChange={(open: boolean) => {
              if (!open) closeModal(modal.id);
            }}
          />
        );
      })}
    </>
  );
};
