import { Plus } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { useInterviewsTab } from '@/pages/jobs/features/detail-modal/model/use-interviews-tab';
import { InterviewCard } from '@/pages/jobs/features/detail-modal/ui/interview-card';
import { InterviewsEmptyState } from '@/pages/jobs/features/detail-modal/ui/interviews-empty-state';
import { InterviewFormDialog } from '@/pages/jobs/features/detail-modal/ui/interview-form-dialog';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type InterviewsTabProps = {
  job: JobApplicationWithStage;
};

export const InterviewsTab = ({ job }: InterviewsTabProps) => {
  const {
    interviews,
    isLoading,
    showForm,
    editingId,
    formData,
    isPending,
    handleOpenForm,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
  } = useInterviewsTab({ jobId: job.id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Scheduled Interviews</h3>
        <Button size="sm" onClick={() => handleOpenForm()}>
          <Plus className="mr-2 size-4" />
          Add Interview
        </Button>
      </div>

      {interviews.length === 0 ? (
        <InterviewsEmptyState onAddClick={() => handleOpenForm()} />
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onEdit={() => handleOpenForm(interview)}
              onDelete={() => handleDelete(interview.id)}
            />
          ))}
        </div>
      )}

      <InterviewFormDialog
        open={showForm}
        isEditing={!!editingId}
        formData={formData}
        isPending={isPending}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        onFieldChange={handleFormChange}
      />
    </div>
  );
};
