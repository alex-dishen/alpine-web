import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { Badge } from '@/shared/shadcn/components/badge';
import { questions } from '@/pages/knowledge/registry/knowledge.constants';

export const KnowledgeQuestions = () => {
  return (
    <div className="space-y-4">
      {questions.map((item, i) => (
        <Card key={i} className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-base">{item.question}</CardTitle>
              <Badge variant={item.variant}>{item.category}</Badge>
            </div>
            <CardDescription className="line-clamp-2">
              Click to view your saved answer and notes for this question...
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
