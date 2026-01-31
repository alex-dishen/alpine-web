import { $api } from '@/configs/api/client';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

type UseFilterBarProps = {
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
};

export const useFilterBar = ({ filters, setFilters }: UseFilterBarProps) => {
  const { data: stages = [] } = $api.useQuery('get', '/api/jobs/stages');

  const stageFilter = filters.stage_id ? [filters.stage_id] : [];
  const selectedStages = stages.filter((s) => stageFilter.includes(s.id));

  const handleStageToggle = (stageId: string) => {
    const newFilter = stageFilter.includes(stageId)
      ? stageFilter.filter((id) => id !== stageId)
      : [...stageFilter, stageId];

    setFilters((prev) => ({ ...prev, stage_id: newFilter[0] }));
  };

  const handleRemoveStage = (stageId: string) => {
    const newFilter = stageFilter.filter((id) => id !== stageId);
    setFilters((prev) => ({ ...prev, stage_id: newFilter[0] }));
  };

  const handleClearAll = () => {
    setFilters((prev) => ({ ...prev, stage_id: undefined }));
  };

  return {
    stages,
    stageFilter,
    selectedStages,
    handleStageToggle,
    handleRemoveStage,
    handleClearAll,
  };
};
