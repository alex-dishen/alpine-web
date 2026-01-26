import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/shadcn/components/toggle-group';
import { useThemeStore, type Theme } from '@/configs/zustand/theme/theme.store';
import { themeOptions } from '@/features/sidebar/registry/sidebar.constants';

export const SidebarThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value: Theme) => value && setTheme(value)}
      variant="outline"
      size="sm"
    >
      {themeOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="cursor-pointer"
        >
          <option.icon className="size-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
