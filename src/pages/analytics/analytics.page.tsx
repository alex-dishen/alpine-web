import { AnalyticsHeader } from '@/pages/analytics/features/analytics.header';
import { AnalyticsStats } from '@/pages/analytics/features/analytics.stats';
import { AnalyticsActivity } from '@/pages/analytics/features/analytics.activity';
import { AnalyticsCompanies } from '@/pages/analytics/features/analytics.companies';
import { AnalyticsStatus } from '@/pages/analytics/features/analytics.status';

export const AnalyticsPage = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <AnalyticsHeader />
        <AnalyticsStats />
        <AnalyticsActivity />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AnalyticsCompanies />
          <AnalyticsStatus />
        </div>
      </div>
    </div>
  );
};
