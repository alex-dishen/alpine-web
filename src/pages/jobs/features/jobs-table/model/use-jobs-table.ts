import { useRef, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import { useJobsList } from '@/pages/jobs/features/jobs-table/model/use-jobs';
import { useQuickUpdateJob } from '@/pages/jobs/features/jobs-table/model/use-quick-update-job';
import { useUpsertColumnValue } from '@/pages/jobs/features/jobs-table/model/use-job-column-values';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import { createJobColumns } from '@/pages/jobs/features/jobs-table/ui/jobs-table-columns';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

type UseJobsTableProps = {
  filters: JobFilters;
};

export const useJobsTable = ({ filters }: UseJobsTableProps) => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Data fetching
  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');
  const { data: stages = [] } = $api.useQuery('get', '/api/jobs/stages');
  const { jobs, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useJobsList(filters);

  // Mutations
  const updateJob = useQuickUpdateJob();
  const upsertColumnValue = useUpsertColumnValue();

  const deleteJob = $api.useMutation('delete', '/api/jobs/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 33,
    overscan: 100,
  });

  // Handlers
  const handleOpenDetail = useCallback(
    (jobId: string) => {
      openModal(MODALS.JobsDetail, { jobId });
    },
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
        onConfirm: () => {
          deleteJob.mutate({ params: { path: { id } } });
        },
      });
    },
    [openModal, deleteJob]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < 700 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Table columns
  const tableColumns = useMemo(
    () =>
      createJobColumns({
        columns,
        stages,
        onUpdateJob: handleUpdateJob,
        onUpdateColumnValue: handleUpdateColumnValue,
        onDeleteJob: handleDeleteJob,
        onOpenDetail: handleOpenDetail,
      }),
    [
      columns,
      stages,
      handleUpdateJob,
      handleUpdateColumnValue,
      handleDeleteJob,
      handleOpenDetail,
    ]
  );

  const table = useReactTable({
    data: jobs,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    jobs,
    isLoading,
    isFetchingNextPage,
    tableContainerRef,
    virtualRows: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
    headerGroups: table.getHeaderGroups(),
    rows: table.getRowModel().rows,
    handleScroll,
    handleOpenDetail,
  };
};
