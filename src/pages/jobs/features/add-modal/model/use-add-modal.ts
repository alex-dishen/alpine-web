import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import {
  createJobSchema,
  type CreateJobFormData,
} from '@/pages/jobs/registry/jobs.types';

type UseAddModalProps = {
  onOpenChange: (open: boolean) => void;
};

export const useAddModal = ({ onOpenChange }: UseAddModalProps) => {
  const queryClient = useQueryClient();
  const { data: stages = [], isLoading: isLoadingStages } = $api.useQuery(
    'get',
    '/api/jobs/stages'
  );

  const createJob = $api.useMutation('post', '/api/jobs', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  const [formData, setFormData] = useState<CreateJobFormData>({
    company_name: '',
    job_title: '',
    stage_id: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateJobFormData, string>>
  >({});

  const handleChange = (field: keyof CreateJobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createJobSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateJobFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateJobFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      return;
    }

    createJob.mutate(
      {
        body: {
          id: uuidv4(),
          ...formData,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            company_name: '',
            job_title: '',
            stage_id: '',
          });
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !formData.stage_id && stages.length > 0) {
      setFormData((prev) => ({ ...prev, stage_id: stages[0].id }));
    }
    onOpenChange(isOpen);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const selectedStage = stages.find((s) => s.id === formData.stage_id);

  return {
    formData,
    errors,
    stages,
    selectedStage,
    isLoadingStages,
    isPending: createJob.isPending,
    isSubmitDisabled:
      createJob.isPending || isLoadingStages || stages.length === 0,
    handleChange,
    handleSubmit,
    handleOpenChange,
    handleCancel,
  };
};
