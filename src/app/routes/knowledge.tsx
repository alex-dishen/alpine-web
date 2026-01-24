import { createFileRoute } from '@tanstack/react-router';
import { KnowledgePage } from '@pages/knowledge/knowledge';

export const Route = createFileRoute('/knowledge')({
  component: KnowledgePage,
});
