import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/shadcn/components/toggle-group';
import { themeOptions } from '@/features/sidebar/registry/sidebar.constants';
import {
  useUserPreferencesStore,
  type Theme,
} from '@/configs/zustand/user-preferences/user-preferences.store';

export const SidebarThemeToggle = () => {
  const theme = useUserPreferencesStore((state) => state.theme);
  const setTheme = useUserPreferencesStore((state) => state.setTheme);

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
