import { Button } from '@/shared/shadcn/components/button';
import { categories } from '@/pages/knowledge/registry/knowledge.constants';

export const KnowledgeCategories = () => {
  return (
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
  );
};
