import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './theme.store';

describe('theme store', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'system' });
  });

  it('should have system as default theme', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('system');
  });

  it('should set theme to dark', () => {
    const { setTheme } = useThemeStore.getState();
    setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should set theme to light', () => {
    const { setTheme } = useThemeStore.getState();
    setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
