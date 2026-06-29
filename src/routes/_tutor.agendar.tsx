import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_tutor/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar atendimento. Vitalis Belém" },
      { name: "description", content: "Selecione especialidade, data e horário para a consulta do seu pet." },
    ],
  }),
  component: AgendarRoute,
});

function AgendarRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/agendar") return <Outlet />;
  return <Agendar />;
}

const especialidades = [
  { id: "clinica", nome: "Clínica Geral", desc: "Avaliação de rotina e sintomas gerais.", icone: Stethoscope },
  { id: "vacinacao", nome: "Vacinação", desc: "Imunização preventiva e reforços.", icone: Syringe },
  { id: "castracao", nome: "Castração", desc: "Procedimento cirúrgico programado.", icone: Scissors },
  { id: "retorno", nome: "Retorno", desc: "Consulta de acompanhamento ou pós cirúrgico.", icone: RotateCcw },
];

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const indisponiveis = new Set(["08:00", "15:00"]);

const fmtMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const fmtMesCurto = new Intl.DateTimeFormat("pt-BR", { month: "long" });
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Agendar() {
  const navigate = useNavigate();
  const { criarAgendamento, setUltimoAgendamentoId } = useVitalisStore();

  const meses = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: 3 }).map((_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      return {
        ano: d.getFullYear(),
        mes: d.getMonth(),
        label: capitalize(fmtMes.format(d)),
        labelCurto: capitalize(fmtMesCurto.format(d)),
      };
    });
  }, []);

  const [mesIndex, setMesIndex] = useState(0);
  const [esp, setEsp] = useState("clinica");
  const [diaSel, setDiaSel] = useState<number | null>(null);
  const [horaSel, setHoraSel] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const mesAtivo = meses[mesIndex];
  const especialidadeAtiva = especialidades.find((e) => e.id === esp)!;

  const primeiroDia = new Date(mesAtivo.ano, mesAtivo.mes, 1).getDay();
  const diasNoMes = new Date(mesAtivo.ano, mesAtivo.mes + 1, 0).getDate();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const podeEnviar = !!diaSel && !!horaSel && !enviando;

  async function handleAgendar() {
    if (!podeEnviar || !diaSel || !horaSel) return;
    setEnviando(true);
    const id = toast.loading("Confirmando seu agendamento...");
    try {
      await new Promise((r) => setTimeout(r, 700));
      const dataISO = `${mesAtivo.ano}-${String(mesAtivo.mes + 1).padStart(2, "0")}-${String(diaSel).padStart(2, "0")}`;
      const ag = criarAgendamento({
        especialidadeId: especialidadeAtiva.id,
        especialidadeNome: especialidadeAtiva.nome,
        dataISO,
        horario: horaSel,
      });
      setUltimoAgendamentoId(ag.id);
      toast.success(`Agendamento confirmado! Protocolo ${ag.protocolo}.`, { id });
      navigate({ to: "/agendar/confirmacao" });
    } catch {
      toast.error("Não foi possível confirmar. Tente novamente.", { id });
      setEnviando(false);
    }
  }

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
                  disabled={enviando}
                  onClick={() => setEsp(e.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition-all disabled:opacity-60",
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
              {diaSel ? `${diaSel} de ${mesAtivo.labelCurto}` : "Selecione uma data..."}
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
              {mesAtivo.label}
            </h2>
            <div className="flex items-center gap-2">
              <button
                disabled={enviando || mesIndex === 0}
                onClick={() => {
                  setMesIndex(Math.max(0, mesIndex - 1));
                  setDiaSel(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-text-strong hover:bg-muted disabled:opacity-40"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={enviando || mesIndex === meses.length - 1}
                onClick={() => {
                  setMesIndex(Math.min(meses.length - 1, mesIndex + 1));
                  setDiaSel(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-text-strong hover:bg-muted disabled:opacity-40"
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
            {Array.from({ length: primeiroDia }).map((_, i) => <div key={`b-${i}`} />)}
            {Array.from({ length: diasNoMes }).map((_, i) => {
              const dia = i + 1;
              const dataDia = new Date(mesAtivo.ano, mesAtivo.mes, dia);
              const passado = dataDia < hoje;
              const ativo = diaSel === dia;
              const temBolinha = !passado && (dia % 5 === 4 || dia % 7 === 2);
              return (
                <button
                  key={dia}
                  disabled={passado || enviando}
                  onClick={() => setDiaSel(dia)}
                  className={cn(
                    "relative aspect-square rounded-full text-sm transition-colors",
                    passado && "cursor-not-allowed text-text-soft/40",
                    !passado && ativo && "bg-primary font-semibold text-primary-foreground",
                    !passado && !ativo && "text-text-strong hover:bg-muted",
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
              Horários Disponíveis {diaSel ? `(${String(diaSel).padStart(2, "0")} ${mesAtivo.labelCurto.slice(0, 3)})` : ""}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {horarios.map((h) => {
                const indisp = indisponiveis.has(h);
                const ativo = horaSel === h;
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={indisp || enviando}
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

        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={!podeEnviar}
          onClick={handleAgendar}
        >
          {enviando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirmando...
            </>
          ) : (
            <>
              Agendar Atendimento <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {enviando && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-6 py-5 shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm font-medium text-text-strong">Confirmando seu agendamento...</p>
            <p className="text-xs text-muted-foreground">Não feche esta janela</p>
          </div>
        </div>
      )}
    </div>
  );
}
