import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const JobsStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Active Applications</CardDescription>
          <CardTitle className="text-3xl">12</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            3 interviews scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Response Rate</CardDescription>
          <CardTitle className="text-3xl">34%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Above average for your field
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
