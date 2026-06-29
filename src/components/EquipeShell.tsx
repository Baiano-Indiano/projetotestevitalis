import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import {
  Bell,
  CalendarDays,
  FileText,
  FlaskConical,
  GitBranchPlus,
  HelpCircle,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserSquare2,
  Users,
  Wifi,
  Bed,
} from "lucide-react";
import { type ReactNode } from "react";
import { useVitalisStore } from "@/data/store";
import { cn } from "@/lib/utils";

interface Item {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: () => ReactNode;
  params?: Record<string, string>;
}


export function EquipeShell() {
  const { triagens, papel } = useVitalisStore();
  const pendentes = triagens.filter((t) => t.status === "pendente" || t.status === "urgencia").length;
  const urgencias = triagens.filter((t) => t.status === "urgencia").length;
  const location = useLocation();

  const itemsRecepcao: Item[] = [
    { to: "/painel", label: "Painel da Recepção", Icon: LayoutGrid },
    { to: "/painel/aguardando", label: "Pacientes Aguardando", Icon: Users, badge: () => pendentes > 0 ? <Badge count={pendentes} /> : null },
    { to: "/painel/triagens", label: "Triagens Online", Icon: Wifi, badge: () => urgencias > 0 ? <Badge count={urgencias} tone="danger" /> : null },
    { to: "/painel/em-atendimento", label: "Em Atendimento", Icon: UserSquare2 },
    { to: "/painel/agenda", label: "Agendamentos", Icon: CalendarDays },
    { to: "/painel/internacoes", label: "Internações", Icon: Bed },
    { to: "/painel/veterinarios", label: "Veterinários", Icon: Stethoscope },
  ];

  const itemsVeterinario: Item[] = [
    { to: "/painel", label: "Painel do Veterinário", Icon: LayoutGrid },
    { to: "/painel/em-atendimento", label: "Pacientes em Atendimento", Icon: UserSquare2 },
    { to: "/painel/ficha/$id", label: "Prontuários", Icon: FileText },
    { to: "/painel/exames", label: "Solicitações de Exames", Icon: FlaskConical },
    { to: "/painel/encaminhamentos", label: "Encaminhamentos", Icon: GitBranchPlus },
    { to: "/painel/validacao", label: "Validação Clínica", Icon: ShieldCheck },
    { to: "/painel/agenda", label: "Agenda do Veterinário", Icon: CalendarDays },
  ];

  const items = papel === "veterinario" ? itemsVeterinario : itemsRecepcao;
  const podeNovoAtendimento = papel === "veterinario";


  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex items-center px-5 pt-6 pb-5 border-b border-border/60">
          <Link to="/painel" className="flex items-center">
            <Logo size="lg" />
          </Link>
        </div>
        <div className="px-3 pt-4 pb-3">
          <Link
            to="/painel/ficha/$id"
            params={{ id: "novo" }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" /> Novo Atendimento
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          <ul className="flex flex-col gap-0.5">
            {items.map((it) => {
              const active =
                it.to === "/painel"
                  ? location.pathname === "/painel"
                  : location.pathname.startsWith(it.to);
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
                    <span className="inline-flex items-center gap-2.5">
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
        <div className="border-t border-border p-3">
          <Link to="/painel" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LifeBuoy className="h-4 w-4" /> Suporte
          </Link>
          <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar pacientes, tutores, exames..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><RoleSwitcher /></div>
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              {urgencias > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />}
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Ajuda">
              <HelpCircle className="h-4 w-4" />
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Configurações">
              <Settings className="h-4 w-4" />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              AS
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
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
