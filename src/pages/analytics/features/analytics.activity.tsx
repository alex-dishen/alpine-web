import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import {
  weeklyActivity,
  days,
} from '@/pages/analytics/registry/analytics.constants';

export const AnalyticsActivity = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Application Activity</CardTitle>
        <CardDescription>Weekly application submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end justify-between gap-2">
          {weeklyActivity.map((height, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-400 transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="text-muted-foreground text-xs">{days[i]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
