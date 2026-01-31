import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { getInterviewsQueryKey } from '@/configs/api/query-keys';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import type {
  JobInterview,
  CreateInterviewFormData,
} from '@/pages/jobs/registry/jobs.types';

type UseInterviewsTabProps = {
  jobId: string;
};

const INITIAL_FORM_DATA: CreateInterviewFormData = {
  type: '',
  scheduled_at: '',
  duration_mins: undefined,
  location: '',
  meeting_url: '',
  notes: '',
  outcome: 'pending',
};

export const useInterviewsTab = ({ jobId }: UseInterviewsTabProps) => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);
  const { data: interviews = [], isLoading } = $api.useQuery(
    'get',
    '/api/jobs/{jobId}/interviews',
    { params: { path: { jobId } } },
    { enabled: !!jobId }
  );

  const createInterview = $api.useMutation(
    'post',
    '/api/jobs/{jobId}/interviews',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: getInterviewsQueryKey(variables.params.path.jobId),
        });
      },
    }
  );

  const updateInterview = $api.useMutation('put', '/api/jobs/interviews/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getInterviewsQueryKey(jobId),
      });
    },
  });

  const deleteInterview = $api.useMutation(
    'delete',
    '/api/jobs/interviews/{id}',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getInterviewsQueryKey(jobId),
        });
      },
    }
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<CreateInterviewFormData>(INITIAL_FORM_DATA);

  const handleOpenForm = (interview?: JobInterview) => {
    if (interview) {
      setEditingId(interview.id);
      setFormData({
        type: interview.type,
        scheduled_at: interview.scheduled_at,
        duration_mins: interview.duration_mins,
        location: interview.location ?? '',
        meeting_url: interview.meeting_url ?? '',
        notes: interview.notes ?? '',
        outcome: interview.outcome,
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM_DATA);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleFormChange = (
    field: keyof CreateInterviewFormData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean form data - remove empty strings for optional fields with URL validation
    const cleanedData = {
      type: formData.type,
      scheduled_at: formData.scheduled_at,
      ...(formData.duration_mins && { duration_mins: formData.duration_mins }),
      ...(formData.location && { location: formData.location }),
      ...(formData.meeting_url && { meeting_url: formData.meeting_url }),
      ...(formData.notes && { notes: formData.notes }),
      ...(formData.outcome && { outcome: formData.outcome }),
    };

    if (editingId) {
      updateInterview.mutate(
        { params: { path: { id: editingId } }, body: cleanedData },
        { onSuccess: handleCloseForm }
      );
    } else {
      createInterview.mutate(
        { params: { path: { jobId } }, body: cleanedData },
        { onSuccess: handleCloseForm }
      );
    }
  };

  const handleDelete = (interviewId: string) => {
    openModal(MODALS.Confirm, {
      title: 'Delete Interview',
      description:
        'Are you sure you want to delete this interview? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => {
        deleteInterview.mutate({ params: { path: { id: interviewId } } });
      },
    });
  };

  return {
    interviews,
    isLoading,
    showForm,
    editingId,
    formData,
    isPending: createInterview.isPending || updateInterview.isPending,
    handleOpenForm,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
  };
};
