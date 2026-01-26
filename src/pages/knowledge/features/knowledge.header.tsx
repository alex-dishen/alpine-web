import { BookOpen } from 'lucide-react';

export const KnowledgeHeader = () => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
        <BookOpen className="size-8" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Store interview questions and answers
        </p>
      </div>
    </div>
  );
};
