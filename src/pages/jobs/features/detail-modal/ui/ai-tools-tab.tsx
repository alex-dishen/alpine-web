import { Sparkles, FileText, MessageSquare, Target } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type AiToolsTabProps = {
  job: JobApplicationWithStage;
};

const aiTools = [
  {
    id: 'resume-tailor',
    title: 'Resume Tailor',
    description: 'Customize your resume to match this job description',
    icon: FileText,
    disabled: true,
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    description: 'Generate a personalized cover letter for this position',
    icon: MessageSquare,
    disabled: true,
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description:
      'Get potential interview questions based on the job description',
    icon: Target,
    disabled: true,
  },
];

export const AiToolsTab = ({ job }: AiToolsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary size-5" />
        <h3 className="text-sm font-medium">AI-Powered Tools</h3>
      </div>

      <p className="text-muted-foreground text-sm">
        Use AI to help you prepare for this job application. These tools analyze
        the job description to provide personalized recommendations.
      </p>

      {!job.notes && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="text-muted-foreground mb-2 size-8" />
            <p className="text-muted-foreground text-center text-sm">
              Add a job description in the Details tab to unlock AI tools
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {aiTools.map((tool) => (
          <Card
            key={tool.id}
            className={!job.notes || tool.disabled ? 'opacity-60' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <tool.icon className="text-primary size-5" />
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                disabled={!job.notes || tool.disabled}
              >
                {tool.disabled ? 'Coming Soon' : 'Generate'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">
        AI features are currently in development and will be available soon.
      </p>
    </div>
  );
};
