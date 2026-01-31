import type { ComponentType } from 'react';
import { ConfirmModal } from '@/features/confirm-modal/confirm-modal';
import { JobsAddModal } from '@/pages/jobs/features/add-modal/jobs.add-modal';
import { JobsColumnManagerModal } from '@/pages/jobs/features/column-manager-modal/jobs.column-manager-modal';
import { JobsDetailModal } from '@/pages/jobs/features/detail-modal/jobs.detail-modal';
import { JobsStageManagerModal } from '@/pages/jobs/features/stage-manager-modal/jobs.stage-manager-modal';
import {
  MODALS,
  type ModalKey,
  type ModalPropsMap,
} from '@/configs/zustand/modals/modals.constants';

type ModalComponents = {
  [K in ModalKey]: ComponentType<ModalPropsMap[K]>;
};

export const modalComponents: ModalComponents = {
  [MODALS.Confirm]: ConfirmModal,
  [MODALS.JobsAdd]: JobsAddModal,
  [MODALS.JobsDetail]: JobsDetailModal,
  [MODALS.JobsColumnManager]: JobsColumnManagerModal,
  [MODALS.JobsStageManager]: JobsStageManagerModal,
};
