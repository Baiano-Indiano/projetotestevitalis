import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Bed, AlertTriangle, LogOut, Stethoscope, Phone, Clock, Plus, X, Package, Minus, Syringe, Pill, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/data/store";
import { toast } from "sonner";
import type { Internacao } from "@/data/types";

export const Route = createFileRoute("/_equipe/painel/internacoes")({
  head: () => ({ meta: [{ title: "Internações. Vitalis Belém" }] }),
  component: Internacoes,
});

const TOTAL_LEITOS = 8;

const INSUMOS_UTI = [
  { id: "seringa-3ml", nome: "Seringa 3ml" },
  { id: "soro-fisio-500", nome: "Soro Fisiológico 500ml" },
  { id: "gaze", nome: "Compressa Gaze" },
  { id: "cateter", nome: "Cateter" },
  { id: "equipo", nome: "Equipo Macrogotas" },
  { id: "esparadrapo", nome: "Esparadrapo" },
] as const;

function tempoInternado(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (dias >= 1) return `Internado há ${dias} dia${dias > 1 ? "s" : ""}`;
  const horas = Math.floor(ms / (1000 * 60 * 60));
  return `Internado há ${Math.max(horas, 1)}h`;
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function Internacoes() {
  const internacoes = useStore((s) => s.internacoes);
  const evolucoesSOAP = useStore((s) => s.evolucoesSOAP);
  const alterarStatusInternacao = useStore((s) => s.alterarStatusInternacao);
  const salvarEvolucaoSOAP = useStore((s) => s.salvarEvolucaoSOAP);

  const [busca, setBusca] = useState("");
  const [selId, setSelId] = useState<string | null>(internacoes[0]?.id ?? null);
  const [novaOpen, setNovaOpen] = useState(false);
  const [novaEvol, setNovaEvol] = useState({ subjetivo: "", objetivo: "", avaliacao: "", plano: "" });
  const [insumosOpen, setInsumosOpen] = useState(false);
  const [insumosQtd, setInsumosQtd] = useState<Record<string, number>>({});

  // Whiteboard de medicações — estado local por (internacaoId|horario|medIdx)
  const HORARIOS_WB = ["08:00", "12:00", "14:00", "16:00", "18:00", "22:00"] as const;
  type MedItem = { tipo: "seringa" | "comprimido"; nome: string };
  const medsPorPaciente: Record<string, MedItem[]> = useMemo(() => {
    const out: Record<string, MedItem[]> = {};
    internacoes.forEach((i, idx) => {
      out[i.id] = idx % 2 === 0
        ? [{ tipo: "seringa", nome: "Dipirona" }, { tipo: "comprimido", nome: "Omeprazol" }]
        : [{ tipo: "seringa", nome: "Ranitidina" }, { tipo: "comprimido", nome: "Cefalexina" }];
    });
    return out;
  }, [internacoes]);

  const agoraH = new Date().getHours();
  const proximoHorarioIdx = (() => {
    const idx = HORARIOS_WB.findIndex((h) => parseInt(h) >= agoraH);
    return idx === -1 ? HORARIOS_WB.length - 1 : idx;
  })();

  const [medStatus, setMedStatus] = useState<Record<string, boolean>>(() => {
    const seed: Record<string, boolean> = {};
    internacoes.forEach((i) => {
      HORARIOS_WB.forEach((h, hi) => {
        if (hi < proximoHorarioIdx) {
          seed[`${i.id}|${h}|0`] = true;
          seed[`${i.id}|${h}|1`] = true;
        }
      });
    });
    return seed;
  });

  const marcarMed = (internacaoId: string, horario: string, medIdx: number, nome: string) => {
    const key = `${internacaoId}|${horario}|${medIdx}`;
    if (medStatus[key]) return;
    setMedStatus((prev) => ({ ...prev, [key]: true }));
    toast.success(`${nome} administrado`, { description: `Horário ${horario}` });
  };


  const filtrados = useMemo(
    () =>
      internacoes.filter((i) =>
        `${i.pacienteNome} ${i.leito} ${i.diagnostico}`.toLowerCase().includes(busca.toLowerCase()),
      ),
    [internacoes, busca],
  );

  const ativas = internacoes.filter((i) => i.status === "internado" || i.status === "critico");
  const criticos = internacoes.filter((i) => i.status === "critico").length;
  const altasHoje = internacoes.filter(
    (i) => i.status === "alta" && i.altaEm && new Date(i.altaEm).toDateString() === new Date().toDateString(),
  ).length;
  const ocupados = ativas.length;
  const livres = Math.max(TOTAL_LEITOS - ocupados, 0);

  const leitosOcupadosMap = new Map(ativas.map((i) => [i.leito, i] as const));
  const leitosGrid = Array.from({ length: TOTAL_LEITOS }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return { num, internacao: leitosOcupadosMap.get(num) ?? null };
  });

  const sel = internacoes.find((i) => i.id === selId) ?? ativas[0] ?? null;
  const evolucoesPaciente = sel
    ? evolucoesSOAP.filter((e) => e.pacienteId === sel.pacienteId).sort((a, b) => +new Date(b.criadoEm) - +new Date(a.criadoEm))
    : [];

  const darAlta = (i: Internacao) => {
    alterarStatusInternacao(i.id, "alta");
    toast.success(`Alta médica registrada · Leito ${i.leito}`, { description: i.pacienteNome });
  };

  const abrirNovaEvolucao = () => {
    if (!sel) return;
    setNovaEvol({ subjetivo: "", objetivo: "", avaliacao: "", plano: "" });
    setNovaOpen(true);
  };

  const salvarNova = () => {
    if (!sel) return;
    if (!novaEvol.subjetivo && !novaEvol.objetivo && !novaEvol.avaliacao && !novaEvol.plano) {
      toast.error("Preencha pelo menos um campo");
      return;
    }
    salvarEvolucaoSOAP({
      pacienteId: sel.pacienteId,
      medico: sel.responsavel,
      ...novaEvol,
    });
    setNovaOpen(false);
    toast.success("Evolução registrada no prontuário", { description: sel.pacienteNome });
  };

  const stats = [
    { Icon: Stethoscope, label: "Internados", valor: ocupados, bg: "bg-primary-50 text-primary" },
    { Icon: AlertTriangle, label: "Críticos", valor: criticos, bg: "bg-destructive-50 text-destructive", destacado: criticos > 0 },
    { Icon: LogOut, label: "Altas Hoje", valor: altasHoje, bg: "bg-success-50 text-success-700" },
    { Icon: Bed, label: "Leitos Livres", valor: livres, bg: "bg-success-50 text-success-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary-700 md:text-4xl">
            Internações
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4" /> {TOTAL_LEITOS} Total</span>
            <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4" /> {ocupados} Ocupados</span>
            <span className="inline-flex items-center gap-1.5 text-success-700">● {livres} Livres</span>
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-64 pl-9"
            placeholder="Buscar paciente, leito..."
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div
              key={s.label}
              className={cn(
                "rounded-2xl border bg-surface p-4 text-center shadow-sm",
                s.destacado ? "border-destructive/40" : "border-border",
              )}
            >
              <span className={cn("mx-auto grid h-9 w-9 place-items-center rounded-xl", s.bg)}>
                <Icone className="h-4 w-4" />
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-text-strong">{s.valor}</p>
              <p className="text-[11px] text-text-soft">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Whiteboard digital de medicações (inspirado SmartFlow) */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-text-strong">
              Quadro Branco — Administração de Medicamentos
            </h2>
            <p className="text-xs text-text-soft">
              Toque num bloco pendente (piscando) para registrar a administração em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-soft">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-success-700" /> Concluído</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-warning-500 animate-pulse" /> Pendente</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-muted" /> Futuro</span>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {ativas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
              Nenhum paciente internado no momento.
            </div>
          )}
          {ativas.map((i) => {
            const meds = medsPorPaciente[i.id] ?? [];
            const critico = i.status === "critico";
            return (
              <div
                key={i.id}
                className={cn(
                  "rounded-2xl border bg-surface p-4 shadow-sm transition-all",
                  critico ? "border-l-4 border-l-destructive border-border" : "border-l-4 border-l-primary border-border",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 font-bold text-primary">
                      {i.pacienteNome[0]}
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-text-strong">
                        {i.pacienteNome} <span className="ml-1 text-xs font-normal text-text-soft">· Leito {i.leito}</span>
                      </p>
                      <p className="text-xs text-text-soft">{i.diagnostico}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    critico ? "bg-destructive text-destructive-foreground" : "bg-success-50 text-success-700",
                  )}>
                    {critico ? "Crítico" : "Estável"}
                  </span>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <div className="grid min-w-max gap-2" style={{ gridTemplateColumns: `140px repeat(${HORARIOS_WB.length}, minmax(72px, 1fr))` }}>
                    <div />
                    {HORARIOS_WB.map((h, hi) => (
                      <div
                        key={h}
                        className={cn(
                          "text-center text-[11px] font-semibold",
                          hi === proximoHorarioIdx ? "text-warning-700" : "text-text-soft",
                        )}
                      >
                        {h}
                      </div>
                    ))}

                    {meds.map((m, mi) => (
                      <>
                        <div key={`lbl-${mi}`} className="flex items-center gap-2 text-xs text-text-strong">
                          {m.tipo === "seringa" ? <Syringe className="h-3.5 w-3.5 text-primary" /> : <Pill className="h-3.5 w-3.5 text-primary" />}
                          <span className="truncate">{m.nome}</span>
                        </div>
                        {HORARIOS_WB.map((h, hi) => {
                          const key = `${i.id}|${h}|${mi}`;
                          const done = !!medStatus[key];
                          const pendente = hi === proximoHorarioIdx && !done;
                          const futuro = hi > proximoHorarioIdx && !done;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => marcarMed(i.id, h, mi, m.nome)}
                              disabled={done}
                              className={cn(
                                "group grid h-12 place-items-center rounded-md border text-xs font-medium transition-all",
                                done && "border-success-700/40 bg-success-50 text-success-700 cursor-default",
                                pendente && "border-warning-500/50 bg-warning-50 text-warning-700 animate-pulse hover:scale-105 hover:shadow-md",
                                futuro && "border-border bg-muted/30 text-text-soft cursor-not-allowed",
                              )}
                              title={done ? "Administrado" : pendente ? "Pendente — clique para administrar" : "Agendado"}
                            >
                              {done ? (
                                <Check className="h-4 w-4" />
                              ) : m.tipo === "seringa" ? (
                                <Syringe className="h-4 w-4" />
                              ) : (
                                <Pill className="h-4 w-4" />
                              )}
                            </button>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mapa de leitos */}
      <div className="mt-6">

        <h2 className="font-display text-base font-semibold text-text-strong">Mapa de Leitos</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {leitosGrid.map(({ num, internacao }) => {
            if (!internacao) {
              return (
                <div
                  key={num}
                  className="rounded-2xl border-2 border-dashed border-success-700/40 bg-success-50/40 p-4 text-center"
                >
                  <Bed className="mx-auto h-5 w-5 text-success-700" />
                  <p className="mt-2 font-display text-sm font-semibold text-success-700">Leito {num}</p>
                  <p className="text-xs text-success-700/80">Leito Disponível</p>
                </div>
              );
            }
            const critico = internacao.status === "critico";
            const ativo = sel?.id === internacao.id;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelId(internacao.id)}
                className={cn(
                  "rounded-2xl border bg-surface p-4 text-left shadow-sm transition-all",
                  critico ? "border-l-4 border-l-destructive border-border" : "border-l-4 border-l-primary border-border",
                  ativo && "ring-2 ring-primary/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-text-soft">
                    LEITO {num}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      critico ? "bg-destructive text-destructive-foreground" : "bg-success-50 text-success-700",
                    )}
                  >
                    {critico ? "Crítico" : "Estável"}
                  </span>
                </div>
                <p className="mt-2 font-display text-base font-semibold text-text-strong">{internacao.pacienteNome}</p>
                <p className="text-xs text-text-soft">{internacao.especie} · {internacao.raca}</p>
                <p className="mt-1 text-xs text-text-soft">{tempoInternado(internacao.criadoEm)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalhes + Evolução SOAP */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          {sel ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary font-bold">
                    {sel.pacienteNome[0]}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-text-strong">{sel.pacienteNome}</p>
                    <p className="text-xs text-text-soft">
                      {sel.especie} · {sel.raca} · Leito {sel.leito} · {tempoInternado(sel.criadoEm)}
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={abrirNovaEvolucao} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Nova Evolução
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-text-strong">
                  Diário Clínico
                </h3>
                <span className="text-xs text-text-soft">{evolucoesPaciente.length} registro(s)</span>
              </div>

              {evolucoesPaciente.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Nenhuma evolução registrada. Clique em "Nova Evolução" para iniciar.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {evolucoesPaciente.map((e) => (
                    <li key={e.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                        <p className="text-xs font-semibold text-text-strong">{e.medico}</p>
                        <p className="text-[11px] text-text-soft">{formatHora(e.criadoEm)}</p>
                      </div>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <CampoSoap rotulo="Queixa" valor={e.subjetivo} />
                        <CampoSoap rotulo="Parâmetros" valor={e.objetivo} />
                        <CampoSoap rotulo="Avaliação" valor={e.avaliacao} />
                        <CampoSoap rotulo="Conduta Clínica / Tratamento" valor={e.plano} />
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Selecione um leito ocupado para ver as evoluções.</p>
          )}
        </div>

        <aside className="space-y-4">
          {sel && (
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <h3 className="font-display text-base font-semibold text-primary-700">Resumo do Paciente</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <Info rotulo="Diagnóstico" valor={sel.diagnostico} />
                <Info rotulo="Responsável" valor={sel.responsavel} />
                {sel.observacoes && <Info rotulo="Observações" valor={sel.observacoes} />}
              </dl>
              <div className="mt-4 border-t border-border pt-3 text-sm">
                <p className="text-xs text-text-soft">Contato Tutor</p>
                <p className="mt-1 inline-flex items-center gap-2 font-medium text-text-strong">
                  {sel.tutorNome} {sel.tutorTelefone && <Phone className="h-3.5 w-3.5 text-primary" />}
                </p>
                {sel.tutorTelefone && <p className="text-xs text-text-soft">{sel.tutorTelefone}</p>}
              </div>
              <div className="mt-4 grid gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => darAlta(sel)}>
                  <LogOut className="h-4 w-4" /> Registrar Alta
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive"
                  onClick={() => {
                    alterarStatusInternacao(sel.id, sel.status === "critico" ? "internado" : "critico");
                    toast.info(sel.status === "critico" ? "Status: Estável" : "Status: Crítico");
                  }}
                >
                  <AlertTriangle className="h-4 w-4" /> Alternar Criticidade
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => {
                    setInsumosQtd({});
                    setInsumosOpen(true);
                  }}
                >
                  <Package className="h-4 w-4" /> Baixar Materiais / Insumos
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-strong">
              <Clock className="h-4 w-4 text-warning-700" /> Filtros e Histórico
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              {filtrados.slice(0, 6).map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setSelId(i.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left",
                      sel?.id === i.id ? "bg-primary-50 text-primary-800" : "hover:bg-muted/40",
                    )}
                  >
                    <span>
                      Leito {i.leito} · <span className="font-semibold">{i.pacienteNome}</span>
                    </span>
                    <span className="text-text-soft">{i.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Dialog open={novaOpen} onOpenChange={setNovaOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Evolução — {sel?.pacienteNome}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["subjetivo", "Queixa"],
                ["objetivo", "Parâmetros"],
                ["avaliacao", "Avaliação"],
                ["plano", "Conduta Clínica / Tratamento"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{label}</p>
                <Textarea
                  rows={4}
                  className="mt-1"
                  value={novaEvol[key]}
                  onChange={(e) => setNovaEvol({ ...novaEvol, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovaOpen(false)}>
              <X className="mr-1.5 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={salvarNova}>Salvar Evolução</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={insumosOpen} onOpenChange={setInsumosOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Baixar Materiais / Insumos
              {sel && <span className="text-sm font-normal text-text-soft">— {sel.pacienteNome}</span>}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-text-soft">
            Selecione os itens utilizados no leito. Os valores serão deduzidos do estoque da UTI.
          </p>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-surface">
            {INSUMOS_UTI.map((i) => {
              const qtd = insumosQtd[i.id] ?? 0;
              const setQtd = (n: number) =>
                setInsumosQtd((prev) => ({ ...prev, [i.id]: Math.max(0, n) }));
              return (
                <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm text-text-strong">{i.nome}</span>
                  <div className="inline-flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => setQtd(qtd - 1)}
                      disabled={qtd === 0}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{qtd}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => setQtd(qtd + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInsumosOpen(false)}>
              <X className="mr-1.5 h-4 w-4" /> Cancelar
            </Button>
            <Button
              onClick={() => {
                const total = Object.values(insumosQtd).reduce((a, b) => a + b, 0);
                if (total === 0) {
                  toast.error("Informe a quantidade de pelo menos um item");
                  return;
                }
                setInsumosOpen(false);
                setInsumosQtd({});
                toast.success("Materiais deduzidos do Estoque da UTI", {
                  description: sel ? `Leito ${sel.leito} · ${sel.pacienteNome}` : undefined,
                });
              }}
            >
              Confirmar baixa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampoSoap({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-soft">{rotulo}</dt>
      <dd className="mt-0.5 text-text-strong">{valor || <span className="text-muted-foreground">—</span>}</dd>
    </div>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-text-soft">{rotulo}:</dt>
      <dd className="text-right font-medium text-text-strong">{valor}</dd>
    </div>
  );
}
