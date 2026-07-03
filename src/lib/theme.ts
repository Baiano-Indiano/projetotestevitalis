export type ThemeMode = "light" | "dark" | "system";

export const THEME_KEY = "vitalis-theme";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "system";
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? getSystemTheme() : mode;
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(mode);
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.style.colorScheme = resolved;
}

type Listener = (mode: ThemeMode) => void;
const listeners = new Set<Listener>();

export function setTheme(mode: ThemeMode) {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_KEY, mode);
  }
  applyTheme(mode);
  listeners.forEach((l) => l(mode));
}

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Watches OS theme changes and re-applies when current mode is "system". */
export function watchSystemTheme() {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getStoredTheme() === "system") applyTheme("system");
  };
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
