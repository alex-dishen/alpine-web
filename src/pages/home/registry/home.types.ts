import type { LinkProps } from '@tanstack/react-router';

type RoutePath = LinkProps['to'];

export type Feature = {
  to: RoutePath;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
};
