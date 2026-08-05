import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const KEY = 'mrermin-theme';

export const ThemeToggle = () => {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem(KEY) === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      aria-label={dark ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
      aria-pressed={dark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-muted"
    >
      {dark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
};
