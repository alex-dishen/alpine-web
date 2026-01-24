import { BookOpen, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  'All',
  'Behavioral',
  'Technical',
  'System Design',
  'Coding',
];

const questions = [
  {
    question: 'Tell me about yourself',
    category: 'Behavioral',
    variant: 'default' as const,
  },
  {
    question: 'What is the difference between == and === in JavaScript?',
    category: 'Technical',
    variant: 'secondary' as const,
  },
  {
    question: 'Design a URL shortener system',
    category: 'System Design',
    variant: 'outline' as const,
  },
  {
    question: 'Describe a challenging project you worked on',
    category: 'Behavioral',
    variant: 'default' as const,
  },
  {
    question: 'Explain React hooks and their benefits',
    category: 'Technical',
    variant: 'secondary' as const,
  },
];

export function KnowledgePage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <BookOpen className="size-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Store interview questions and answers
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search questions, topics, or answers..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category, i) => (
            <Button
              key={category}
              variant={i === 0 ? 'default' : 'secondary'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {questions.map((item, i) => (
            <Card
              key={i}
              className="cursor-pointer transition-all hover:shadow-md"
            >
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
      </div>
    </div>
  );
}
