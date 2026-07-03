import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Monitor, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  setTheme,
  subscribeTheme,
  watchSystemTheme,
  type ThemeMode,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações. Vitalis" }] }),
  component: ConfiguracoesPage,
});

const OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Claro", Icon: Sun },
  { value: "dark", label: "Escuro", Icon: Moon },
  { value: "system", label: "Sistema", Icon: Monitor },
];

function ConfiguracoesPage() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = getStoredTheme();
    setMode(stored);
    applyTheme(stored);
    const unsub = subscribeTheme((m) => setMode(m));
    const unwatch = watchSystemTheme();
    return () => {
      unsub();
      unwatch();
    };
  }, []);

  const choose = (next: ThemeMode) => {
    setMode(next);
    setTheme(next);
    const resolved = resolveTheme(next);
    toast.success(
      next === "system"
        ? `Usando preferência do sistema (${resolved === "dark" ? "escuro" : "claro"})`
        : `Tema ${resolved === "dark" ? "escuro" : "claro"} ativado`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-soft">
          Preferências
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-strong">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste as preferências de aparência e uso do Vitalis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SettingsIcon className="h-4 w-4" aria-hidden="true" /> Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            role="radiogroup"
            aria-label="Selecionar tema da interface"
            className="grid gap-2 sm:grid-cols-3"
          >
            {OPTIONS.map(({ value, label, Icon }) => {
              const selected = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`Tema ${label.toLowerCase()}`}
                  onClick={() => choose(value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      choose(value);
                    }
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      const i = OPTIONS.findIndex((o) => o.value === value);
                      choose(OPTIONS[(i + 1) % OPTIONS.length].value);
                    }
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const i = OPTIONS.findIndex((o) => o.value === value);
                      choose(OPTIONS[(i - 1 + OPTIONS.length) % OPTIONS.length].value);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-strong">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {value === "system"
                        ? "Segue a preferência do seu dispositivo."
                        : value === "dark"
                          ? "Reduz o brilho em ambientes escuros."
                          : "Ideal para leitura em ambientes claros."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            A preferência fica salva neste dispositivo e é aplicada instantaneamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
