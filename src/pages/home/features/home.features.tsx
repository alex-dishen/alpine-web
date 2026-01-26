import { Link } from '@tanstack/react-router';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { features } from '@/pages/home/registry/home.constants';

export const HomeFeatures = () => {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <Link key={feature.to} to={feature.to}>
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <div
                className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md`}
              >
                <feature.icon className="size-6" />
              </div>
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};
