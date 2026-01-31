import { create } from 'zustand';
import type {
  ModalKey,
  ModalPropsMap,
} from '@/configs/zustand/modals/modals.constants';
import type { BaseModalProps } from '@/configs/zustand/modals/modals.props';

type ModalExtraProps<K extends ModalKey> = Omit<
  ModalPropsMap[K],
  keyof BaseModalProps
>;

type OpenModal<K extends ModalKey = ModalKey> = {
  id: K;
  props: ModalExtraProps<K>;
};

type ModalsState = {
  modals: OpenModal[];
  openModal: <K extends ModalKey>(id: K, props: ModalExtraProps<K>) => void;
  closeModal: (id: ModalKey) => void;
  closeAllModals: () => void;
};

export const useModalsStore = create<ModalsState>((set) => ({
  modals: [],

  openModal: (id, props) =>
    set((state) => ({
      modals: [...state.modals, { id, props }],
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),

  closeAllModals: () => set({ modals: [] }),
}));
