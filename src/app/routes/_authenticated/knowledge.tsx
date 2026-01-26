import { createFileRoute } from '@tanstack/react-router';
import { KnowledgePage } from '@/pages/knowledge/knowledge.page';

export const Route = createFileRoute('/_authenticated/knowledge')({
  component: KnowledgePage,
});
