import { useState } from 'react';
import { $api } from '@/configs/api/client';
import { useUpdateJob } from '@/pages/jobs/features/detail-modal/model/use-update-job';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type DetailsFormData = {
  company_name: string;
  job_title: string;
  stage_id: string;
  applied_at: string;
  notes: string;
};

type UseDetailsTabProps = {
  job: JobApplicationWithStage;
};

export const useDetailsTab = ({ job }: UseDetailsTabProps) => {
  const { data: stages = [] } = $api.useQuery('get', '/api/jobs/stages');
  const updateJob = useUpdateJob();

  const [formData, setFormData] = useState<DetailsFormData>({
    company_name: job.company_name,
    job_title: job.job_title,
    stage_id: job.stage_id,
    applied_at: job.applied_at ?? '',
    notes: job.notes ?? '',
  });

  const handleFieldChange = (field: keyof DetailsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: keyof DetailsFormData) => {
    const fieldMapping: Record<string, keyof JobApplicationWithStage> = {
      company_name: 'company_name',
      job_title: 'job_title',
      stage_id: 'stage_id',
      applied_at: 'applied_at',
      notes: 'notes',
    };

    const jobField = fieldMapping[field];
    const originalValue = job[jobField];
    const newValue = formData[field] || null;

    if (originalValue !== newValue) {
      updateJob.mutate({
        params: { path: { id: job.id } },
        body: { [field]: newValue },
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    const newValue = date?.toISOString() ?? '';
    setFormData((prev) => ({ ...prev, applied_at: newValue }));
    updateJob.mutate({
      params: { path: { id: job.id } },
      body: { applied_at: newValue || undefined },
    });
  };

  const handleStageChange = (stageId: string) => {
    setFormData((prev) => ({ ...prev, stage_id: stageId }));
    updateJob.mutate({
      params: { path: { id: job.id } },
      body: { stage_id: stageId },
    });
  };

  return {
    formData,
    stages,
    handleFieldChange,
    handleFieldBlur,
    handleDateChange,
    handleStageChange,
  };
};
