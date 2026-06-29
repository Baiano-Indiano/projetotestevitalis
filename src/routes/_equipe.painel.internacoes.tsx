import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sliders, Download, ChevronDown, Bed, AlertTriangle, LogOut, Pill, Stethoscope, Phone, Clock, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/internacoes")({
  head: () => ({ meta: [{ title: "Internações. Vitalis Belém" }] }),
  component: Internacoes,
});

const internados = [
  { nome: "Thor", info: "Canino · Golden Retriever · Leito 01", responsavel: "Dra. Silva", tempo: "Internado há 4 dias", status: "critico" },
  { nome: "Luna", info: "Felino · SRD · Leito 03", responsavel: "Dr. Costa", tempo: "Internado há 2 dias", status: "estavel" },
  { nome: "Bidu", info: "Canino · Poodle · Leito 04", responsavel: "Dra. Marina", tempo: "Internado há 1 dia", status: "estavel" },
];

function Internacoes() {
  const stats = [
    { Icon: Stethoscope, label: "Internados", valor: 1, bg: "bg-primary-50 text-primary" },
    { Icon: AlertTriangle, label: "Casos Críticos", valor: 2, bg: "bg-destructive-50 text-destructive", destacado: true },
    { Icon: LogOut, label: "Altas Hoje", valor: 3, bg: "bg-success-50 text-success-700" },
    { Icon: Pill, label: "Meds Pendentes", valor: 5, bg: "bg-warning-50 text-warning-700" },
    { Icon: Bed, label: "Procedimentos", valor: 8, bg: "bg-primary-50 text-primary" },
    { Icon: Bed, label: "Leitos Livres", valor: 4, bg: "bg-success-50 text-success-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary-700 md:text-4xl">
            Internações
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4" /> 12 Total</span>
            <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4" /> 8 Ocupados</span>
            <span className="inline-flex items-center gap-1.5 text-success-700">● 4 Livres</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 3.5 Dias Média</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="w-64 pl-9" placeholder="Buscar paciente, leito..." />
          </div>
          <Button variant="outline" size="icon"><Sliders className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div key={s.label} className={cn("rounded-2xl border bg-surface p-4 text-center shadow-sm", s.destacado ? "border-destructive/40" : "border-border")}>
              <span className={cn("mx-auto grid h-9 w-9 place-items-center rounded-xl", s.bg)}>
                <Icone className="h-4 w-4" />
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-text-strong">{s.valor}</p>
              <p className="text-[11px] text-text-soft">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-display text-base font-semibold text-text-strong">Pacientes em Monitoramento</h2>
          <ul className="mt-3 space-y-3">
            {internados.map((i) => {
              const critico = i.status === "critico";
              return (
                <li key={i.nome} className={cn(
                  "flex flex-wrap items-center gap-4 rounded-2xl border bg-surface p-4 shadow-sm",
                  critico ? "border-l-4 border-l-destructive border-y border-r border-y-border border-r-border" : "border-l-4 border-l-success border-y border-r border-y-border border-r-border",
                )}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-50 text-primary font-bold">
                    {i.nome[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-strong">{i.nome}</p>
                    <p className="text-xs text-text-soft">{i.info}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-text-soft">Responsável</p>
                    <p className="font-medium text-text-strong">{i.responsavel}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-text-soft">Tempo</p>
                    <p className="font-medium text-text-strong">{i.tempo}</p>
                  </div>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                    critico ? "bg-destructive text-destructive-foreground" : "bg-success-50 text-success-700",
                  )}>
                    {critico ? "Crítico" : "Estável"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-text-soft" />
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="font-display text-base font-semibold text-primary-700">Resumo do Paciente</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Info rotulo="Diagnóstico Principal" valor="Parvovirose" />
              <Info rotulo="Restrições" valor="Jejum hídrico até 12h" />
              <Info rotulo="Alergias" valor="Penicilina" destaque="destructive" />
            </dl>
            <div className="mt-4 border-t border-border pt-3 text-sm">
              <p className="text-xs text-text-soft">Contato Tutor</p>
              <p className="mt-1 inline-flex items-center gap-2 font-medium text-text-strong">
                João Silva <Phone className="h-3.5 w-3.5 text-primary" />
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-strong">
              <AlertTriangle className="h-4 w-4 text-warning-700" /> Alertas da Internação
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="rounded-lg bg-warning-50/60 p-2.5">
                <p className="inline-flex items-center gap-1.5 font-medium text-warning-700"><Clock className="h-3.5 w-3.5" /> Medicação Atrasada</p>
                <p className="mt-0.5 text-xs text-text-strong">Thor (Leito 01) · Dipirona IV (14:00)</p>
              </li>
              <li className="rounded-lg bg-warning-50/40 p-2.5">
                <p className="inline-flex items-center gap-1.5 font-medium text-warning-700"><FileWarning className="h-3.5 w-3.5" /> Exame Pendente</p>
                <p className="mt-0.5 text-xs text-text-strong">Bidu (Leito 04) · Hemograma</p>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: "destructive" }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-text-soft">{rotulo}:</dt>
      <dd className={cn("font-medium", destaque === "destructive" ? "text-destructive" : "text-text-strong")}>{valor}</dd>
    </div>
  );
}
