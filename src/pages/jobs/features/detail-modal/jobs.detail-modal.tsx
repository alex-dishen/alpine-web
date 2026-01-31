import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/tabs';
import { Badge } from '@/shared/shadcn/components/badge';
import { Button } from '@/shared/shadcn/components/button';
import { Trash2 } from 'lucide-react';
import { DetailsTab } from '@/pages/jobs/features/detail-modal/ui/details-tab';
import { InterviewsTab } from '@/pages/jobs/features/detail-modal/ui/interviews-tab';
import { AiToolsTab } from '@/pages/jobs/features/detail-modal/ui/ai-tools-tab';
import { useDetailModal } from '@/pages/jobs/features/detail-modal/model/use-detail-modal';
import type { JobsDetailModalProps } from '@/configs/zustand/modals/modals.props';

export const JobsDetailModal = ({
  open,
  jobId,
  onOpenChange,
}: JobsDetailModalProps) => {
  const { job, stage, handleDelete } = useDetailModal({ jobId, onOpenChange });

  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{job.job_title}</SheetTitle>
              <p className="text-muted-foreground text-sm">
                {job.company_name}
              </p>
            </div>
            {stage && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: `${stage.color}20`,
                  color: stage.color,
                  borderColor: stage.color,
                }}
                className="border"
              >
                {stage.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <DetailsTab key={job.id} job={job} />
          </TabsContent>

          <TabsContent value="interviews" className="mt-4">
            <InterviewsTab job={job} />
          </TabsContent>

          <TabsContent value="ai-tools" className="mt-4">
            <AiToolsTab job={job} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
