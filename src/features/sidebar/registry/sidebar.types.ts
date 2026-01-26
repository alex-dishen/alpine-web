import type { ThemeEnum } from '@/shared/enums/theme.enum';
import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  icon: LucideIcon;
  url: LinkProps['to'];
};

export type ThemeOption = {
  label: string;
  value: ThemeEnum;
  icon: LucideIcon;
};
