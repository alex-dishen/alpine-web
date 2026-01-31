import { format } from 'date-fns';
import { Pencil, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Badge } from '@/shared/shadcn/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { INTERVIEW_OUTCOME_LABELS } from '@/pages/jobs/registry/jobs.constants';
import type { JobInterview } from '@/pages/jobs/registry/jobs.types';

const outcomeColors: Record<string, string> = {
  pending: '#3B82F6',
  passed: '#10B981',
  failed: '#EF4444',
  canceled: '#9CA3AF',
};

type InterviewCardProps = {
  interview: JobInterview;
  onEdit: () => void;
  onDelete: () => void;
};

export const InterviewCard = ({
  interview,
  onEdit,
  onDelete,
}: InterviewCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{interview.type}</CardTitle>
            <CardDescription>
              {format(new Date(interview.scheduled_at), 'PPP')}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            style={{
              backgroundColor: `${outcomeColors[interview.outcome]}20`,
              color: outcomeColors[interview.outcome],
            }}
          >
            {INTERVIEW_OUTCOME_LABELS[interview.outcome]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4" />
            {format(new Date(interview.scheduled_at), 'PPP p')}
            {interview.duration_mins && (
              <>
                <Clock className="ml-2 size-4" />
                {interview.duration_mins} min
              </>
            )}
          </div>
          {interview.location && (
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="size-4" />
              {interview.location}
            </div>
          )}
          {interview.meeting_url && (
            <div className="text-muted-foreground flex items-center gap-2">
              <a
                href={interview.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Meeting Link
              </a>
            </div>
          )}
          {interview.notes && (
            <p className="text-muted-foreground mt-2">{interview.notes}</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
