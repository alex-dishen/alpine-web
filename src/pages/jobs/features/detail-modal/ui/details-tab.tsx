import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Label } from '@/shared/shadcn/components/label';
import { Calendar } from '@/shared/shadcn/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/select';
import { Separator } from '@/shared/shadcn/components/separator';
import { cn } from '@/shared/shadcn/utils/utils';
import { useDetailsTab } from '@/pages/jobs/features/detail-modal/model/use-details-tab';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type DetailsTabProps = {
  job: JobApplicationWithStage;
};

export const DetailsTab = ({ job }: DetailsTabProps) => {
  const {
    formData,
    stages,
    handleFieldChange,
    handleFieldBlur,
    handleDateChange,
    handleStageChange,
  } = useDetailsTab({ job });

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company_name}
            onChange={(e) => handleFieldChange('company_name', e.target.value)}
            onBlur={() => handleFieldBlur('company_name')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.job_title}
            onChange={(e) => handleFieldChange('job_title', e.target.value)}
            onBlur={() => handleFieldBlur('job_title')}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select value={formData.stage_id} onValueChange={handleStageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Applied Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start font-normal',
                  !formData.applied_at && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.applied_at
                  ? format(new Date(formData.applied_at), 'PPP')
                  : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  formData.applied_at
                    ? new Date(formData.applied_at)
                    : undefined
                }
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          onBlur={() => handleFieldBlur('notes')}
          placeholder="Add any notes about this application..."
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};
