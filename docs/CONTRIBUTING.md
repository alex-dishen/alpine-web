# Contributing to Alpine Web

## Code Standards

### TypeScript

- Strict mode is enabled
- Prefer explicit return types on exported functions
- Use `type` imports for type-only imports
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use function declarations for components
- Prefer composition over inheritance
- Keep components focused and small
- Extract hooks for reusable logic

### Styling

- Use Tailwind CSS utility classes
- Use CSS variables for theming (defined in index.css)
- Follow mobile-first responsive design
- Use the `cn()` utility for conditional classes

### No Barrel Files

Do not create `index.ts` files that only re-export from other files.

```typescript
// Bad - don't create these files
// features/theme/index.ts
export { useThemeStore } from './model/theme.store';
export { ThemeToggle } from './ui/theme-toggle';

// Good - import directly from source
import { useThemeStore } from '@features/theme/model/theme.store';
import { ThemeToggle } from '@features/theme/ui/theme-toggle';
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

Example: `feature/job-tracking-dashboard`

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

Example: `feat(jobs): add job application form`

## Pull Request Process

1. Ensure all checks pass (lint, type check, tests)
2. Update documentation if needed
3. Request review from at least one team member
4. Squash and merge after approval

## Testing

- Write tests for business logic and complex components
- Use React Testing Library for component tests
- Mock API calls with MSW (when added)
- Aim for meaningful coverage, not 100%

### Test File Location

Co-locate tests with source files:

```
features/
└── theme/
    ├── model/
    │   ├── theme.store.ts
    │   └── theme.store.test.ts
    └── ui/
        ├── theme-toggle.tsx
        └── theme-toggle.test.tsx
```

## Adding New Features

1. Create feature folder under `src/features/`
2. Add subfolders as needed: `api/`, `model/`, `ui/`
3. Import directly from source files (no barrel files)
4. Add route if needed in `src/app/routes/`
5. Update documentation if introducing new patterns
