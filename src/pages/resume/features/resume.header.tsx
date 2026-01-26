import { FileText } from 'lucide-react';

export const ResumeHeader = () => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
        <FileText className="size-8" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Resume Builder</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Create and customize professional resumes
        </p>
      </div>
    </div>
  );
};
