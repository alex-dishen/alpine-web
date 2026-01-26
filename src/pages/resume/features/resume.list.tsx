import { FileText, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { savedResumes } from '@/pages/resume/registry/resume.constants';

export const ResumeList = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Resumes</CardTitle>
        <CardDescription>Previously saved resumes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedResumes.map((resume, i) => (
          <div
            key={i}
            className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <FileText className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="font-medium">{resume.name}</p>
                <p className="text-muted-foreground text-sm">
                  Updated {resume.updated}
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground size-5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
