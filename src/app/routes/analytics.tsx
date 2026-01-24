import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsPage } from '@pages/analytics/analytics';

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
});
