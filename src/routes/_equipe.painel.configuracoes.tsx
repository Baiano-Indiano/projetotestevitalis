import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_equipe/painel/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações. Vitalis" }] }),
  component: ConfiguracoesPage,
});

const THEME_KEY = "vitalis-theme";

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function ConfiguracoesPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "light" | "dark" | null) ?? "light";
    setDark(saved === "dark");
    applyTheme(saved);
  }, []);

  const toggleTheme = (checked: boolean) => {
    const next = checked ? "dark" : "light";
    setDark(checked);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    toast.success(`Tema ${next === "dark" ? "escuro" : "claro"} ativado`);
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
            <SettingsIcon className="h-4 w-4" /> Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              {dark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <div>
                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                  Tema {dark ? "escuro" : "claro"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alterne entre modo claro e escuro. A preferência fica salva neste dispositivo.
                </p>
              </div>
            </div>
            <Switch id="theme-toggle" checked={dark} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
