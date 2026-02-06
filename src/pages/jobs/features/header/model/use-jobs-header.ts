import { useMemo } from 'react';
import { $api } from '@/configs/api/client';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import { useDebouncedFilters } from '@/pages/jobs/model/use-debounced-filters';
import { mapFiltersToApi } from '@/pages/jobs/model/map-filters-to-api';

export const useJobsHeader = () => {
  const openModal = useModalsStore((state) => state.openModal);

  // Get debounced filters for count query
  const { debouncedSearch, debouncedFilters } = useDebouncedFilters();
  const apiFilters = useMemo(
    () => mapFiltersToApi(debouncedFilters),
    [debouncedFilters]
  );

  const { data: countData } = $api.useQuery('post', '/api/jobs/count', {
    body: {
      search: debouncedSearch || undefined,
      is_archived: false,
      column_filters: apiFilters.length > 0 ? apiFilters : undefined,
    },
  });

  const search = useJobsTableStore((state) => state.search);
  const setSearch = useJobsTableStore((state) => state.setSearch);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleOpenColumnManager = () => {
    openModal(MODALS.JobsColumnManager);
  };

  const handleOpenStageManager = () => {
    openModal(MODALS.JobsStageManager);
  };

  const handleOpenAddJob = () => {
    openModal(MODALS.JobsAdd);
  };

  return {
    count: countData?.count,
    search,
    handleSearchChange,
    handleOpenColumnManager,
    handleOpenStageManager,
    handleOpenAddJob,
  };
};
