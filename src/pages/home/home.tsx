import { Link } from '@tanstack/react-router';
import { Briefcase, FileText, BookOpen, BarChart3 } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    to: '/jobs',
    title: 'Job Tracking',
    description: 'Track your job applications and their status',
    icon: Briefcase,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    to: '/resume',
    title: 'Resume Builder',
    description: 'Create and customize professional resumes',
    icon: FileText,
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    to: '/knowledge',
    title: 'Knowledge Base',
    description: 'Store interview questions and answers',
    icon: BookOpen,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    to: '/analytics',
    title: 'Analytics',
    description: 'Insights into your job search progress',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Alpine</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your job search assistant
        </p>
      </div>

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
    </div>
  );
}
