import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { Progress } from '@/shared/shadcn/components/progress';
import { topCompanies } from '@/pages/analytics/registry/analytics.constants';

export const AnalyticsCompanies = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Companies</CardTitle>
        <CardDescription>Applications by company type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCompanies.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-muted-foreground">{item.count}</span>
            </div>
            <Progress value={item.percent} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
