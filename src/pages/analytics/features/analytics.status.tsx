import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const AnalyticsStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
        <CardDescription>Current pipeline overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <div className="relative size-32">
            <svg className="-rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-muted"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-emerald-500"
                strokeWidth="3"
                strokeDasharray="60 100"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-blue-500"
                strokeWidth="3"
                strokeDasharray="25 100"
                strokeDashoffset="-60"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-amber-500"
                strokeWidth="3"
                strokeDasharray="15 100"
                strokeDashoffset="-85"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">47</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Applied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Interview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Offer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
