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

// Check if type is an empty object
type IsEmptyObject<T> = keyof T extends never ? true : false;

// Make props optional if ModalExtraProps is empty
type OpenModalArgs<K extends ModalKey> =
  IsEmptyObject<ModalExtraProps<K>> extends true
    ? [id: K, props?: ModalExtraProps<K>]
    : [id: K, props: ModalExtraProps<K>];

type ModalsState = {
  modals: OpenModal[];
  openModal: <K extends ModalKey>(...args: OpenModalArgs<K>) => void;
  closeModal: (id: ModalKey) => void;
  closeAllModals: () => void;
};

export const useModalsStore = create<ModalsState>((set) => ({
  modals: [],

  openModal: (id, props = {} as never) =>
    set((state) => ({
      modals: [...state.modals, { id, props }],
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),

  closeAllModals: () => set({ modals: [] }),
}));
