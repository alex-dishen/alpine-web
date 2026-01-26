import { Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/shadcn/components/card';
import { Input } from '@/shared/shadcn/components/input';

export const KnowledgeSearch = () => {
  return (
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
  );
};
