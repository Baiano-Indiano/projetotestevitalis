import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Syringe,
  Scissors,
  RotateCcw,
  CalendarDays,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar atendimento. Vitalis Belém" },
      { name: "description", content: "Selecione especialidade, data e horário para a consulta do seu pet." },
    ],
  }),
  component: Agendar,
});

const especialidades = [
  { id: "clinica", nome: "Clínica Geral", desc: "Avaliação de rotina e sintomas gerais.", icone: Stethoscope },
  { id: "vacinacao", nome: "Vacinação", desc: "Imunização preventiva e reforços.", icone: Syringe },
  { id: "castracao", nome: "Castração", desc: "Procedimento cirúrgico programado.", icone: Scissors },
  { id: "retorno", nome: "Retorno", desc: "Consulta de acompanhamento ou pós cirúrgico.", icone: RotateCcw },
];

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const indisponiveis = new Set(["08:00", "15:00"]);

function Agendar() {
  const [esp, setEsp] = useState("clinica");
  const [diaSel, setDiaSel] = useState<number | null>(7);
  const [horaSel, setHoraSel] = useState<string | null>("10:00");
  const [mesIndex, setMesIndex] = useState(0);

  const meses = ["Outubro 2024", "Novembro 2024", "Dezembro 2024"];
  const especialidadeAtiva = especialidades.find((e) => e.id === esp)!;

  return (
    <div className="container-app py-6 md:py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
          Agendar Atendimento
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione a especialidade, data e horário para a consulta do seu pet.
        </p>

        {/* Especialidades */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Stethoscope className="h-4 w-4" />
            <h2 className="font-display text-base font-semibold">Especialidade</h2>
          </div>
          <div className="space-y-2.5">
            {especialidades.map((e) => {
              const ativo = esp === e.id;
              const Icone = e.icone;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEsp(e.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition-all",
                    ativo ? "border-primary bg-primary-50 ring-2 ring-primary/15" : "border-border hover:border-primary/40",
                  )}
                >
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", ativo ? "bg-primary text-primary-foreground" : "bg-primary-50 text-primary")}>
                    <Icone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-strong">{e.nome}</p>
                    <p className="truncate text-xs text-text-soft">{e.desc}</p>
                  </div>
                  {ativo && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-semibold text-text-strong">Resumo do Agendamento</p>
          <div className="mt-3 space-y-2 text-sm">
            <p className="inline-flex items-center gap-2 text-text-strong">
              <Stethoscope className="h-4 w-4 text-primary" /> {especialidadeAtiva.nome}
            </p>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              {diaSel ? `${diaSel} de ${meses[mesIndex].split(" ")[0]}` : "Selecione uma data..."}
            </p>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {horaSel || "Selecione um horário..."}
            </p>
          </div>
        </div>

        {/* Calendário */}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-strong">
              {meses[mesIndex]}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMesIndex(Math.max(0, mesIndex - 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-text-strong hover:bg-muted"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMesIndex(Math.min(meses.length - 1, mesIndex + 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-text-strong hover:bg-muted"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-text-soft">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
            {/* Out 2024 começa numa Terça → 2 espaços vazios */}
            {Array.from({ length: 2 }).map((_, i) => <div key={`b-${i}`} />)}
            {Array.from({ length: 31 }).map((_, i) => {
              const dia = i + 1;
              const ativo = diaSel === dia;
              const temBolinha = dia === 4 || dia === 9;
              return (
                <button
                  key={dia}
                  onClick={() => setDiaSel(dia)}
                  className={cn(
                    "relative aspect-square rounded-full text-sm transition-colors",
                    ativo ? "bg-primary font-semibold text-primary-foreground" : "text-text-strong hover:bg-muted",
                  )}
                >
                  {dia}
                  {temBolinha && !ativo && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-success" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-semibold text-text-strong">
              Horários Disponíveis {diaSel ? `(${String(diaSel).padStart(2, "0")} Out)` : ""}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {horarios.map((h) => {
                const indisp = indisponiveis.has(h);
                const ativo = horaSel === h;
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={indisp}
                    onClick={() => setHoraSel(h)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                      indisp && "cursor-not-allowed border-border bg-muted text-text-soft line-through",
                      !indisp && ativo && "border-primary bg-primary-50 text-primary-800 ring-2 ring-primary/15",
                      !indisp && !ativo && "border-border bg-background text-text-strong hover:border-primary/40",
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Button size="lg" className="mt-5 w-full" disabled={!diaSel || !horaSel}>
          Agendar Atendimento <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
