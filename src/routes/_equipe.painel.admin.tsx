import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Megaphone, AlertTriangle, Clock, ArrowRight, CalendarDays, FileText, Bed, FlaskConical, GitBranchPlus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/admin")({
  head: () => ({ meta: [{ title: "Visão Administrativa. Vitalis Belém" }] }),
  component: Admin,
});

const cards = [
  { v: 24, label: "Atendimentos do Dia", tag: "Em andamento", tone: "primary" as const },
  { v: 3, label: "Pacientes Internados", tag: "Estável", tone: "success" as const },
  { v: 6, label: "Exames Pendentes", tag: "Atenção", tone: "destructive" as const },
  { v: 8, label: "Encaminhamentos", tag: "Ativo", tone: "primary" as const },
  { v: 12, label: "Vet. em Atendimento", tag: "Operacional", tone: "success" as const },
  { v: 15, label: "Consultas Concluídas", tag: "Finalizado", tone: "muted" as const },
];

const modulos = [
  { to: "/painel/agenda", titulo: "Agenda do Dia", desc: "Visualizar consultas e fluxo de atendimentos", Icon: CalendarDays },
  { to: "/painel/aguardando", titulo: "Ficha Clínica", desc: "Prontuários e histórico médico completo", Icon: FileText },
  { to: "/painel/internacoes", titulo: "Internações", desc: "Controle de leitos e monitoramento clínico", Icon: Bed },
  { to: "/painel/exames", titulo: "Solicitações de Exames", desc: "Gerencie pedidos e resultados recebidos", Icon: FlaskConical },
  { to: "/painel/encaminhamentos", titulo: "Encaminhamentos", desc: "Status de encaminhamentos internos e externos", Icon: GitBranchPlus },
];

function Admin() {
  const data = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Olá, Administrador
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Hospital Veterinário · {data}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-success-700">
            <span className="h-2 w-2 rounded-full bg-success" /> Sistema Online
          </p>
          <p className="mt-1.5 text-sm text-text-strong">
            Hoje existem <strong>24</strong> atendimentos programados, <strong>6</strong> exames pendentes e <strong>3</strong> pacientes internados.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => {
          const cor =
            c.tone === "primary" ? "text-primary border-primary/10"
              : c.tone === "success" ? "text-success-700 border-success/20"
              : c.tone === "destructive" ? "text-destructive border-destructive/20"
              : "text-muted-foreground border-border";
          const pillCor =
            c.tone === "primary" ? "bg-primary-50 text-primary-800"
              : c.tone === "success" ? "bg-success-50 text-success-700"
              : c.tone === "destructive" ? "bg-destructive-50 text-destructive"
              : "bg-muted text-muted-foreground";
          return (
            <div key={c.label} className={cn("rounded-2xl border bg-surface p-4 shadow-sm", cor)}>
              <p className="text-xs text-text-soft">{c.label}</p>
              <p className={cn("mt-1.5 font-display text-3xl font-bold", cor)}>{c.v}</p>
              <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", pillCor)}>{c.tag}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-strong">Módulos Administrativos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((m) => {
              const Icone = m.Icon;
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                    <Icone className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-text-strong">{m.titulo}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                  <ArrowRight className="mt-3 h-4 w-4 text-text-soft transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
          <Button variant="destructive" size="lg" className="mt-6">
            <AlertTriangle className="mr-2 h-4 w-4" /> Nova Emergência
          </Button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-strong">
              <Megaphone className="h-4 w-4 text-primary" /> Alertas Operacionais
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="rounded-lg bg-destructive-50/60 p-3">
                <p className="inline-flex items-center gap-1.5 font-semibold text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" /> Pacientes aguardando internação
                </p>
                <p className="mt-1 text-xs text-text-strong">2 leitos críticos pendentes de limpeza.</p>
              </li>
              <li className="rounded-lg bg-warning-50/60 p-3">
                <p className="inline-flex items-center gap-1.5 font-semibold text-warning-700">
                  <Clock className="h-3.5 w-3.5" /> Exames atrasados
                </p>
                <p className="mt-1 text-xs text-text-strong">Laboratório relata atraso em 3 hemogramas.</p>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text-strong">Agenda Resumida do Dia</h3>
              <Link to="/painel/agenda" className="text-xs font-medium text-primary hover:underline">Ver tudo</Link>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="text-right">
                  <p className="font-mono font-semibold text-text-strong">10:30</p>
                  <p className="text-[10px] text-text-soft">Sala 2</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-strong">Bidu (Canino)</p>
                  <p className="text-xs text-text-soft">Tutor: Maria Silva · Dra. Ana</p>
                </div>
                <span className="rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-semibold text-warning-700">Aguardando</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-right">
                  <p className="font-mono font-semibold text-text-strong">11:00</p>
                  <p className="text-[10px] text-text-soft">Sala 1</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-strong">Mingau (Felino)</p>
                  <p className="text-xs text-text-soft">Tutor: João P. · Dr. Carlos</p>
                </div>
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-800">Em Consulta</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
