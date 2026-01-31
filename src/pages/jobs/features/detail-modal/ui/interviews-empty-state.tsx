import { Calendar } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Card, CardContent } from '@/shared/shadcn/components/card';

type InterviewsEmptyStateProps = {
  onAddClick: () => void;
};

export const InterviewsEmptyState = ({
  onAddClick,
}: InterviewsEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Calendar className="text-muted-foreground mb-2 size-8" />
        <p className="text-muted-foreground text-sm">No interviews scheduled</p>
        <Button variant="link" size="sm" className="mt-2" onClick={onAddClick}>
          Add your first interview
        </Button>
      </CardContent>
    </Card>
  );
};
