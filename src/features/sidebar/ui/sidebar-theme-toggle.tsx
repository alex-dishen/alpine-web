import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/shadcn/components/toggle-group';
import { useTheme, type Theme } from '@/features/preferences/model/use-theme';
import { themeOptions } from '@/features/sidebar/registry/sidebar.constants';

export const SidebarThemeToggle = () => {
  const { theme, setTheme } = useTheme();

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
