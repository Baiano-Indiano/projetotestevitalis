import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import {
  Bell,
  CalendarDays,
  FileText,
  FlaskConical,
  GitBranchPlus,
  Inbox,
  ShieldCheck,
  Stethoscope,
  Building2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useVitalisStore } from "@/data/store";
import { municipio } from "@/config/municipio";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Item {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: () => ReactNode;
  roles: Array<"recepcao" | "veterinario" | "gestor">;
}

export function EquipeShell() {
  const { triagens, papel } = useVitalisStore();
  const [unidadeId, setUnidadeId] = useState(municipio.unidades[1]?.id ?? municipio.unidades[0].id);
  const pendentes = triagens.filter((t) => t.status === "pendente" || t.status === "urgencia").length;
  const urgencias = triagens.filter((t) => t.status === "urgencia").length;
  const location = useLocation();

  const items: Item[] = [
    { to: "/painel/recepcao", label: "Recepção", Icon: Inbox, roles: ["recepcao", "veterinario", "gestor"], badge: () => pendentes > 0 ? <Badge count={pendentes} /> : null },
    { to: "/painel/validacao", label: "Validação", Icon: ShieldCheck, roles: ["recepcao", "veterinario", "gestor"], badge: () => urgencias > 0 ? <Badge count={urgencias} tone="danger" /> : null },
    { to: "/painel/agenda", label: "Agenda", Icon: CalendarDays, roles: ["recepcao", "veterinario", "gestor"] },
    { to: "/painel/ficha/_demo", label: "Ficha clínica", Icon: FileText, roles: ["veterinario", "gestor"] },
    { to: "/painel/exames", label: "Exames", Icon: FlaskConical, roles: ["veterinario", "gestor"] },
    { to: "/painel/encaminhamentos", label: "Encaminhamentos", Icon: GitBranchPlus, roles: ["veterinario", "gestor"] },
  ];

  const role = papel === "tutor" ? "recepcao" : papel;
  const visible = items.filter((i) => i.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Logo />
        </div>
        <nav className="px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-soft">
            Operação
          </p>
          <ul className="flex flex-col gap-0.5">
            {visible.map((it) => {
              const active = location.pathname.startsWith(it.to.replace("/_demo", ""));
              return (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary-800"
                        : "text-muted-foreground hover:bg-muted hover:text-text-strong",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      <it.Icon className="h-4 w-4" />
                      {it.label}
                    </span>
                    {it.badge?.()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center gap-2 text-xs text-text-soft">
            <Stethoscope className="h-4 w-4" />
            <span>O Vitalis orienta, o veterinário decide.</span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select value={unidadeId} onValueChange={setUnidadeId}>
              <SelectTrigger className="h-9 w-[260px] border-border bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {municipio.unidades.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <button
              type="button"
              className="relative rounded-md border border-border bg-surface p-2 text-muted-foreground hover:bg-muted"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              {urgencias > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-50 text-xs font-semibold text-primary-800">
                MV
              </span>
              <span className="hidden text-sm font-medium text-text-strong sm:inline">
                Dra. Marina Vieira
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Badge({ count, tone = "neutral" }: { count: number; tone?: "neutral" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
        tone === "danger"
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary-100 text-primary-800",
      )}
    >
      {count}
    </span>
  );
}
