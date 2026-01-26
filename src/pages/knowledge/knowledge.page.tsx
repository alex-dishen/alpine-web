import { KnowledgeHeader } from '@/pages/knowledge/features/knowledge.header';
import { KnowledgeSearch } from '@/pages/knowledge/features/knowledge.search';
import { KnowledgeCategories } from '@/pages/knowledge/features/knowledge.categories';
import { KnowledgeQuestions } from '@/pages/knowledge/features/knowledge.questions';

export const KnowledgePage = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <KnowledgeHeader />
        <KnowledgeSearch />
        <KnowledgeCategories />
        <KnowledgeQuestions />
      </div>
    </div>
  );
};
