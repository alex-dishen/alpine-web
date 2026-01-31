import type {
  ConfirmModalProps,
  JobsAddModalProps,
  JobsColumnManagerModalProps,
  JobsDetailModalProps,
  JobsStageManagerModalProps,
} from '@/configs/zustand/modals/modals.props';

export const MODALS = {
  Confirm: 'Confirm',
  JobsAdd: 'JobsAdd',
  JobsDetail: 'JobsDetail',
  JobsColumnManager: 'JobsColumnManager',
  JobsStageManager: 'JobsStageManager',
} as const;

export type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export type ModalPropsMap = {
  [MODALS.Confirm]: ConfirmModalProps;
  [MODALS.JobsAdd]: JobsAddModalProps;
  [MODALS.JobsDetail]: JobsDetailModalProps;
  [MODALS.JobsColumnManager]: JobsColumnManagerModalProps;
  [MODALS.JobsStageManager]: JobsStageManagerModalProps;
};
