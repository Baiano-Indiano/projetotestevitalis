import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Clock, Calendar, Droplet, Activity, Microscope, CheckCircle2, Check, Printer, X, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/exames")({
  head: () => ({ meta: [{ title: "Solicitações de Exames. Vitalis Belém" }] }),
  component: Exames,
});

function Exames() {
  const stats = [
    { Icon: Clock, label: "Pendentes", valor: 24, bg: "bg-destructive-50 text-destructive" },
    { Icon: Calendar, label: "Hoje", valor: 12, bg: "bg-primary-50 text-primary" },
    { Icon: Droplet, label: "Hemograma", valor: 45, bg: "bg-success-50 text-success-700" },
    { Icon: Activity, label: "Raio X", valor: 18, bg: "bg-warning-50 text-warning-700" },
    { Icon: Microscope, label: "Ultrassom", valor: 9, bg: "bg-primary-50 text-primary" },
    { Icon: CheckCircle2, label: "Concluídos", valor: 104, bg: "bg-success-50 text-success-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Solicitações de Exames
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestão de diagnósticos laboratoriais e de imagem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="w-48 pl-9" placeholder="Buscar..." />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Filtros</Button>
          <Button size="sm" className="bg-success hover:bg-success/90"><Plus className="mr-1 h-3.5 w-3.5" /> Nova Solicitação</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-strong">Lista de Solicitações</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Ordenar por Data
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Droplet className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-text-strong">
                    Hemograma Completo + Perfil Renal{" "}
                    <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-800">#EXM-4092</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Paciente: <span className="font-medium text-text-strong">Bolinha</span> (Canino, Poodle) · Tutor: João Silva
                  </p>
                  <p className="mt-0.5 text-xs text-text-soft">Hoje, 10:30 · Solicitado por Dra. Amanda</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-[11px] font-semibold text-warning-700">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Em Análise
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-1">
              {[
                { l: "Solicitado", c: true, Icon: Check },
                { l: "Coletado", c: true, Icon: Check },
                { l: "Em Análise", a: true, Icon: Activity },
                { l: "Laudo", Icon: FileText },
              ].map((s, i, arr) => (
                <div key={s.l} className="relative flex flex-col items-center">
                  {i < arr.length - 1 && (
                    <span className={cn("absolute left-1/2 top-4 h-0.5 w-full", s.c ? "bg-primary" : "bg-border")} />
                  )}
                  <span className={cn(
                    "relative z-10 grid h-8 w-8 place-items-center rounded-full",
                    s.c ? "bg-primary text-primary-foreground" : s.a ? "bg-primary-50 text-primary border-2 border-primary" : "bg-muted text-muted-foreground",
                  )}>
                    <s.Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className={cn("mt-1.5 text-[11px] font-medium", s.a ? "text-primary" : s.c ? "text-text-strong" : "text-text-soft")}>{s.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Informações Clínicas</p>
                <div className="mt-2 rounded-lg border border-border bg-background p-3 text-sm">
                  <p className="text-xs text-text-soft">Justificativa</p>
                  <p className="mt-1 text-text-strong">
                    Paciente apresenta letargia, poliúria e polidipsia há 3 dias. Suspeita de insuficiência renal aguda ou diabetes mellitus.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-text-soft">Prioridade</p>
                      <p className="font-semibold text-destructive">▲ Alta</p>
                    </div>
                    <div>
                      <p className="text-text-soft">Amostra</p>
                      <p className="font-medium text-text-strong">Sangue Total (EDTA) + Soro</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Ações Rápidas</p>
                <div className="mt-2 space-y-2">
                  <Button className="w-full" size="sm">Digitar Resultados / Emitir Laudo</Button>
                  <Button variant="outline" className="w-full" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Imprimir Etiquetas</Button>
                  <Button variant="outline" className="w-full" size="sm"><X className="mr-1.5 h-3.5 w-3.5" /> Cancelar Solicitação</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Activity className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-text-strong">
                    Raio X Tórax (VD/LL){" "}
                    <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-800">#EXM-4091</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Paciente: <span className="font-medium text-text-strong">Mia</span> (Felino, SRD) · Tutor: Carlos Mendes
                  </p>
                  <p className="mt-0.5 text-xs text-text-soft">Ontem, 16:45 · Solicitado por Dr. Roberto</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Concluído
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs">
              <span className="font-medium text-text-strong">Imagens e Laudo</span>
              <Button variant="ghost" size="sm" className="text-primary"><Eye className="mr-1 h-3.5 w-3.5" /> Baixar PDF</Button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="font-display text-base font-semibold text-text-strong">Contexto do Paciente</h3>
            <div className="mt-3 text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-2xl text-primary">🐩</span>
              <p className="mt-2 font-semibold text-text-strong">Bolinha</p>
              <p className="text-xs text-text-soft">Canino · Poodle · 8 anos</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">Abrir Prontuário Completo</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Alertas Clínicos</p>
            <div className="mt-2 rounded-lg bg-destructive-50 p-3 text-sm">
              <p className="font-semibold text-destructive">▲ Paciente idoso</p>
              <p className="mt-0.5 text-xs text-text-strong">Atenção à função renal em anestesias.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Histórico Recente</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-text-strong">Consulta de Retorno</p>
                  <p className="text-xs text-text-soft">Hoje, 09:15 · Dra. Amanda</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-text-soft" />
                <div>
                  <p className="font-medium text-text-strong">Ultrassom Abdominal</p>
                  <p className="text-xs text-text-soft">Há 6 meses · Sem alterações</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-text-soft" />
                <div>
                  <p className="font-medium text-text-strong">Vacina V10 + Raiva</p>
                  <p className="text-xs text-text-soft">Há 8 meses · Dr. Carlos</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
