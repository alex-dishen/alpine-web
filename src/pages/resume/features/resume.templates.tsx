import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { templates } from '@/pages/resume/registry/resume.constants';

export const ResumeTemplates = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template.name}
          className="cursor-pointer transition-all hover:shadow-lg"
        >
          <CardContent className="pt-6">
            <div
              className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${template.color} mb-4 opacity-80 transition-opacity hover:opacity-100`}
            />
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>Template</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
