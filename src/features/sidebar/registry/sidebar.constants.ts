import {
  Sun,
  Home,
  Moon,
  Monitor,
  FileText,
  BookOpen,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import type {
  NavItem,
  ThemeOption,
} from '@/features/sidebar/registry/sidebar.types';
import { ThemeEnum } from '@/shared/enums/theme.enum';

export const navItems: NavItem[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Job Tracking', url: '/jobs', icon: Briefcase },
  { title: 'Resume Builder', url: '/resume', icon: FileText },
  { title: 'Knowledge Base', url: '/knowledge', icon: BookOpen },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

export const themeOptions: ThemeOption[] = [
  { value: ThemeEnum.LIGHT, icon: Sun, label: 'Light' },
  { value: ThemeEnum.DARK, icon: Moon, label: 'Dark' },
  { value: ThemeEnum.SYSTEM, icon: Monitor, label: 'System' },
];
