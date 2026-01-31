import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type UseDetailModalProps = {
  jobId: string;
  onOpenChange: (open: boolean) => void;
};

type JobsQueryData = {
  pages?: {
    data?: JobApplicationWithStage[];
  }[];
};

export const useDetailModal = ({
  jobId,
  onOpenChange,
}: UseDetailModalProps) => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);
  const { data: stages = [] } = $api.useQuery('get', '/api/jobs/stages');

  const jobsData = queryClient.getQueriesData<JobsQueryData>({
    queryKey: JOBS_QUERY_KEY,
  });

  const job =
    jobsData
      .flatMap(([, data]) => data?.pages ?? [])
      .flatMap((page) => page.data ?? [])
      .find((j) => j.id === jobId) ?? null;

  const deleteJob = $api.useMutation('delete', '/api/jobs/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  const stage = job ? stages.find((s) => s.id === job.stage_id) : undefined;

  const handleDelete = () => {
    if (!job) return;

    openModal(MODALS.Confirm, {
      title: 'Delete Job',
      description:
        'Are you sure you want to delete this job? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => {
        deleteJob.mutate(
          { params: { path: { id: job.id } } },
          { onSuccess: () => onOpenChange(false) }
        );
      },
    });
  };

  return {
    job,
    stage,
    handleDelete,
  };
};
