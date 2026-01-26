import { BarChart3 } from 'lucide-react';

export const AnalyticsHeader = () => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
        <BarChart3 className="size-8" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Insights into your job search progress
        </p>
      </div>
    </div>
  );
};
