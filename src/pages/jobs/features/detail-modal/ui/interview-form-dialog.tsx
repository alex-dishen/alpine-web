import { format } from 'date-fns';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Label } from '@/shared/shadcn/components/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import { INTERVIEW_OUTCOME_LABELS } from '@/pages/jobs/registry/jobs.constants';
import type { CreateInterviewFormData } from '@/pages/jobs/registry/jobs.types';

type InterviewFormDialogProps = {
  open: boolean;
  isEditing: boolean;
  formData: CreateInterviewFormData;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (
    field: keyof CreateInterviewFormData,
    value: string | number | undefined
  ) => void;
};

export const InterviewFormDialog = ({
  open,
  isEditing,
  formData,
  isPending,
  onClose,
  onSubmit,
  onFieldChange,
}: InterviewFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Interview' : 'Add Interview'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Interview Type *</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => onFieldChange('type', e.target.value)}
              placeholder="e.g., Technical Interview Round 1"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date & Time *</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={
                  formData.scheduled_at
                    ? format(
                        new Date(formData.scheduled_at),
                        "yyyy-MM-dd'T'HH:mm"
                      )
                    : ''
                }
                onChange={(e) =>
                  onFieldChange(
                    'scheduled_at',
                    e.target.value ? new Date(e.target.value).toISOString() : ''
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_mins">Duration (minutes)</Label>
              <Input
                id="duration_mins"
                type="number"
                value={formData.duration_mins ?? ''}
                onChange={(e) =>
                  onFieldChange(
                    'duration_mins',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                placeholder="e.g., 60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Select
              value={formData.outcome}
              onValueChange={(value) =>
                onFieldChange(
                  'outcome',
                  value as CreateInterviewFormData['outcome']
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INTERVIEW_OUTCOME_LABELS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onFieldChange('location', e.target.value)}
              placeholder="e.g., Office address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_url">Meeting URL</Label>
            <Input
              id="meeting_url"
              type="url"
              value={formData.meeting_url}
              onChange={(e) => onFieldChange('meeting_url', e.target.value)}
              placeholder="e.g., https://zoom.us/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              placeholder="Add any notes..."
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEditing ? 'Save Changes' : 'Add Interview'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
