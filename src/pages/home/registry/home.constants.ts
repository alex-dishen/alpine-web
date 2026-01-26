import { Briefcase, FileText, BookOpen, BarChart3 } from 'lucide-react';
import type { Feature } from '@/pages/home/registry/home.types';

export const features: Feature[] = [
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
