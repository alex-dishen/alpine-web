import { ResumeHeader } from '@/pages/resume/features/resume.header';
import { ResumeTemplates } from '@/pages/resume/features/resume.templates';
import { ResumeList } from '@/pages/resume/features/resume.list';

export const ResumePage = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <ResumeHeader />
        <ResumeTemplates />
        <ResumeList />
      </div>
    </div>
  );
};
