import { FileText, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const templates = [
  { name: 'Modern', color: 'from-blue-400 to-blue-600' },
  { name: 'Classic', color: 'from-gray-400 to-gray-600' },
  { name: 'Creative', color: 'from-pink-400 to-purple-600' },
];

const savedResumes = [
  { name: 'Software Engineer Resume', updated: '2 days ago' },
  { name: 'Frontend Developer CV', updated: '1 week ago' },
];

export function ResumePage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <FileText className="size-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Resume Builder
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Create and customize professional resumes
            </p>
          </div>
        </div>

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
      </div>
    </div>
  );
}
