import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Stethoscope, CalendarDays, Clock, AlertTriangle, PawPrint, Cat, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/em-atendimento")({
  head: () => ({ meta: [{ title: "Pacientes em Atendimento. Vitalis Belém" }] }),
  component: EmAtendimento,
});

type Prioridade = "vermelho" | "laranja" | "amarelo" | "verde" | "azul";

const prioridadeMap: Record<Prioridade, { dot: string; label: string }> = {
  vermelho: { dot: "bg-red-500", label: "Emergência" },
  laranja: { dot: "bg-orange-500", label: "Muito urgente" },
  amarelo: { dot: "bg-yellow-500", label: "Urgente" },
  verde: { dot: "bg-emerald-500", label: "Pouco urgente" },
  azul: { dot: "bg-blue-500", label: "Não urgente" },
};

const pacientes: Array<{
  nome: string; especie: string; tutor: string; vet: string; esp: string;
  inicio: string; duracao: string; status: string; prioridade: Prioridade;
}> = [
  { nome: "Rex", especie: "cao", tutor: "Maria Silva", vet: "Dr. Ricardo Silva", esp: "Ortopedia", inicio: "10:45", duracao: "15 min", status: "procedimento", prioridade: "laranja" },
  { nome: "Luna", especie: "gato", tutor: "João Souza", vet: "Dra. Ana Mendes", esp: "Clínica Geral", inicio: "10:30", duracao: "30 min", status: "atendimento", prioridade: "verde" },
  { nome: "Thor", especie: "cao", tutor: "Ana Oliveira", vet: "Dr. Marcos Souza", esp: "Cardiologia", inicio: "10:15", duracao: "45 min", status: "exames", prioridade: "vermelho" },
  { nome: "Bidu", especie: "cao", tutor: "Carlos Mendes", vet: "Dra. Juliana Pires", esp: "Nefrologia", inicio: "09:50", duracao: "70 min", status: "atendimento", prioridade: "amarelo" },
];

function EmAtendimento() {
  const stats = [
    { Icon: Stethoscope, label: "Total em atendimento", valor: 8, bg: "bg-primary-50 text-primary" },
    { Icon: CalendarDays, label: "Iniciados hoje", valor: 32, bg: "bg-success-50 text-success-700" },
    { Icon: Clock, label: "Tempo médio", valor: "45 min", bg: "bg-primary-50 text-primary" },
    { Icon: AlertTriangle, label: "Casos prioritários", valor: 2, bg: "bg-destructive-50 text-destructive" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
        Pacientes em Atendimento
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Acompanhe e gerencie os atendimentos veterinários em andamento na unidade.
      </p>

      {/* Banner de última chamada */}
      <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5 shadow-sm">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 text-primary shadow-sm">
              <Volume2 className="h-5 w-5 animate-pulse" />
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-700">Última chamada</span>
              <span className="text-xs text-text-soft">Painel de chamada pública</span>
            </div>
          </div>
          <div className="flex-1 text-left md:text-center">
            <p className="font-display text-4xl font-bold leading-tight tracking-tight text-primary-900 md:text-5xl">
              REX <span className="text-primary-400">·</span> Consultório 02
            </p>
          </div>
          <div className="hidden md:block md:w-[140px]" aria-hidden />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl", s.bg)}>
                  <Icone className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-text-strong">{s.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar paciente, tutor ou veterinário..." />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Especialidade</Button>
          <Button variant="outline" size="sm"><Stethoscope className="mr-1.5 h-3.5 w-3.5" /> Veterinário</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Status</Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-[11px] text-text-soft">
        <span className="font-semibold uppercase tracking-wider">Protocolo de Manchester:</span>
        {(Object.keys(prioridadeMap) as Prioridade[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", prioridadeMap[k].dot)} />
            {prioridadeMap[k].label}
          </span>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full">
          <thead className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
            <tr>
              <th className="px-4 py-3">Paciente & Tutor</th>
              <th className="px-4 py-3">Veterinário</th>
              <th className="px-4 py-3">Início / Duração</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {pacientes.map((p) => {
              const Icone = p.especie === "gato" ? Cat : PawPrint;
              return (
                <tr key={p.nome} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary">
                        <Icone className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white", prioridadeMap[p.prioridade].dot)}
                            title={`Manchester: ${prioridadeMap[p.prioridade].label}`}
                            aria-label={`Prioridade ${prioridadeMap[p.prioridade].label}`}
                          />
                          <span className="font-semibold text-text-strong">{p.nome}</span>
                        </span>
                        <span className="text-xs text-text-soft">Tutor: {p.tutor}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-col">
                      <span className="font-medium text-text-strong">{p.vet}</span>
                      <span className="text-xs text-text-soft">{p.esp}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-col">
                      <span className="font-medium text-text-strong">{p.inicio}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-text-soft"><Clock className="h-3 w-3" /> {p.duracao}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill s={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline">Detalhes</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, { c: string; d: string; label: string }> = {
    procedimento: { c: "bg-primary-50 text-primary-800", d: "bg-primary", label: "Em procedimento" },
    atendimento: { c: "bg-success-50 text-success-700", d: "bg-success", label: "Em atendimento" },
    exames: { c: "bg-warning-50 text-warning-700", d: "bg-warning", label: "Aguardando exames" },
  };
  const cfg = map[s];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", cfg.c)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.d)} /> {cfg.label}
    </span>
  );
}
