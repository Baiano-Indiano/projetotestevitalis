import { createFileRoute } from "@tanstack/react-router";
import { Wifi, Clock, Stethoscope, CheckCircle2, AlertTriangle, Search, Filter, PawPrint, Cat, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVitalisStore } from "@/data/store";
import { nomeEspecialidade } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/triagens")({
  head: () => ({ meta: [{ title: "Triagens Online. Vitalis Belém" }] }),
  component: TriagensOnline,
});

function TriagensOnline() {
  const { triagens } = useVitalisStore();

  const stats = [
    { label: "Recebidas Hoje", valor: triagens.length, Icon: Wifi, bg: "bg-primary-50 text-primary" },
    { label: "Pendentes", valor: triagens.filter((t) => t.status === "pendente").length, Icon: Clock, bg: "bg-destructive-50 text-destructive" },
    { label: "Em Análise", valor: 5, Icon: Stethoscope, bg: "bg-success-50 text-success-700" },
    { label: "Concluídas", valor: 45, Icon: CheckCircle2, bg: "bg-success-50 text-success-700" },
    { label: "Alta Prioridade", valor: triagens.filter((t) => t.prioridade === "alta").length, Icon: AlertTriangle, bg: "bg-destructive-50 text-destructive" },
  ];

  const linhas = triagens.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
        Triagens Online
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gerencie e monitore as triagens de pacientes recebidas e pendentes.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
                <span className={cn("grid h-7 w-7 place-items-center rounded-lg", s.bg)}>
                  <Icone className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-text-strong">{s.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por tutor, paciente ou protocolo..." />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Especialidade</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Prioridade</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Status</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              <tr>
                <th className="px-4 py-3">Protocolo</th>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Tutor</th>
                <th className="px-4 py-3">Especialidade</th>
                <th className="px-4 py-3">Data/Hora</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {linhas.map((t, i) => {
                const urgente = t.prioridade === "alta" || t.status === "urgencia";
                const Icone = t.animal.especie === "gato" ? Cat : PawPrint;
                const hora = new Date(t.criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 font-mono text-xs">
                        {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        {t.protocolo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-50 text-primary">
                          <Icone className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium text-text-strong">{t.animal.nome}</span>
                        <span className="text-text-soft">({t.animal.especie === "cao" ? "Cão" : t.animal.especie === "gato" ? "Gato" : "Animal"})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-strong">{t.tutor.nome}</td>
                    <td className="px-4 py-3 text-text-strong">
                      {t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao as never)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">Hoje, {hora}</td>
                    <td className="px-4 py-3">
                      <PrioPill p={t.prioridade} urgente={urgente} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={t.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
          <span>Exibindo 1 a {linhas.length} de {triagens.length + 20} resultados</span>
          <div className="flex items-center gap-1">
            <button className="grid h-7 w-7 place-items-center rounded border border-border text-muted-foreground hover:bg-muted"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <button className="grid h-7 w-7 place-items-center rounded bg-primary text-xs font-semibold text-primary-foreground">1</button>
            <button className="grid h-7 w-7 place-items-center rounded border border-border text-muted-foreground hover:bg-muted">2</button>
            <button className="grid h-7 w-7 place-items-center rounded border border-border text-muted-foreground hover:bg-muted"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrioPill({ p, urgente }: { p: string; urgente: boolean }) {
  const cfg = urgente
    ? { c: "bg-destructive-50 text-destructive-700", d: "bg-destructive", label: "Urgent" }
    : p === "media"
      ? { c: "bg-warning-50 text-warning-700", d: "bg-warning", label: "Medium" }
      : { c: "bg-warning-50/60 text-warning-700", d: "bg-warning", label: "High" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", cfg.c)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.d)} />
      {cfg.label}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { c: string; label: string }> = {
    pendente: { c: "bg-primary-50 text-primary-800", label: "Recebida" },
    urgencia: { c: "bg-warning-50 text-warning-700", label: "Em análise" },
    validada: { c: "bg-success-50 text-success-700", label: "Aguardando contato" },
    redirecionada: { c: "bg-muted text-muted-foreground", label: "Redirecionada" },
  };
  const cfg = map[status] ?? map.pendente;
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold", cfg.c)}>{cfg.label}</span>;
}
