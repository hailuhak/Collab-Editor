"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();

   // Avoid hydration mismatch by waiting until mounted on client.
   const mounted = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false
   );

   if (!mounted) {
      return <div className="h-9 w-9" />;
   }

   return (
      <button
         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
         className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
         aria-label="Toggle theme"
      >
         {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
   );
}
