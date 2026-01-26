export const categories = [
  'All',
  'Behavioral',
  'Technical',
  'System Design',
  'Coding',
];

export const questions = [
  {
    question: 'Tell me about yourself',
    category: 'Behavioral',
    variant: 'default' as const,
  },
  {
    question: 'What is the difference between == and === in JavaScript?',
    category: 'Technical',
    variant: 'secondary' as const,
  },
  {
    question: 'Design a URL shortener system',
    category: 'System Design',
    variant: 'outline' as const,
  },
  {
    question: 'Describe a challenging project you worked on',
    category: 'Behavioral',
    variant: 'default' as const,
  },
  {
    question: 'Explain React hooks and their benefits',
    category: 'Technical',
    variant: 'secondary' as const,
  },
];
