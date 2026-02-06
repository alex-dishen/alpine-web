import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import { useJobsList } from '@/pages/jobs/features/jobs-table/model/use-jobs-list';
import { useQuickUpdateJob } from '@/pages/jobs/features/jobs-table/model/use-quick-update-job';
import { useUpsertColumnValue } from '@/pages/jobs/features/jobs-table/model/use-job-column-values';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';

export const useJobsData = () => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);

  const {
    jobs,
    columns,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useJobsList();

  const updateJob = useQuickUpdateJob();
  const upsertColumnValue = useUpsertColumnValue();
  const deleteJob = $api.useMutation('delete', '/api/jobs/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  // Handlers
  const handleOpenDetail = useCallback(
    (jobId: string) => openModal(MODALS.JobsDetail, { jobId }),
    [openModal]
  );

  const handleUpdateJob = useCallback(
    (id: string, field: string, value: unknown) => {
      updateJob.mutate({
        params: { path: { id } },
        body: { [field]: value },
      });
    },
    [updateJob]
  );

  const handleUpdateColumnValue = useCallback(
    (jobId: string, columnId: string, value: Record<string, unknown>) => {
      upsertColumnValue.mutate({
        params: { path: { jobId, columnId } },
        body: value,
      });
    },
    [upsertColumnValue]
  );

  const handleDeleteJob = useCallback(
    (id: string) => {
      openModal(MODALS.Confirm, {
        title: 'Delete Job',
        description:
          'Are you sure you want to delete this job? This action cannot be undone.',
        confirmLabel: 'Delete',
        variant: 'destructive',
        onConfirm: () => deleteJob.mutate({ params: { path: { id } } }),
      });
    },
    [openModal, deleteJob]
  );

  return {
    // Data
    jobs,
    columns,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    // Actions
    fetchNextPage,
    handleOpenDetail,
    handleUpdateJob,
    handleUpdateColumnValue,
    handleDeleteJob,
  };
};
