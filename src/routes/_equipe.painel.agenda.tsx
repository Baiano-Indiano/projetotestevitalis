import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Stethoscope,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useVitalisStore } from "@/data/store";
import { veterinarios } from "@/data/veterinarios";
import { municipio, nomeEspecialidade, especialidadesAtivas } from "@/config/municipio";
import type { Agendamento, StatusAgendamento } from "@/data/types";

export const Route = createFileRoute("/_equipe/painel/agenda")({
  head: () => ({ meta: [{ title: "Agenda da equipe. Vitalis" }] }),
  component: AgendaPage,
});

const SLOTS = (() => {
  const s: string[] = [];
  for (let h = 8; h < 18; h++) {
    s.push(`${String(h).padStart(2, "0")}:00`);
    s.push(`${String(h).padStart(2, "0")}:30`);
  }
  return s;
})();

const STATUS_META: Record<StatusAgendamento, { label: string; cls: string; dot: string }> = {
  pendente: { label: "Pendente", cls: "bg-warning-50 text-warning-700 border-warning-200", dot: "bg-warning" },
  confirmado: { label: "Confirmado", cls: "bg-primary-50 text-primary-800 border-primary-200", dot: "bg-primary" },
  "check-in": { label: "Check-in", cls: "bg-cyan-50 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
  "em-atendimento": { label: "Em atendimento", cls: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  concluido: { label: "Concluído", cls: "bg-success-50 text-success-700 border-success-200", dot: "bg-success" },
  cancelado: { label: "Cancelado", cls: "bg-muted text-muted-foreground border-border line-through", dot: "bg-muted-foreground" },
  falta: { label: "Faltou", cls: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
};

const dateToISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmtData = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(y, m - 1, d),
  );
};

function AgendaPage() {
  const { agendamentos, criarAgendamento, atualizarStatusAgendamento, removerAgendamento } = useVitalisStore();

  const [data, setData] = useState<Date>(() => new Date());
  const [unidadeF, setUnidadeF] = useState<string>("todas");
  const [especF, setEspecF] = useState<string>("todas");
  const [vetF, setVetF] = useState<string>("todos");
  const [statusF, setStatusF] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<Agendamento | null>(null);
  const [novoAberto, setNovoAberto] = useState(false);
  const [slotPre, setSlotPre] = useState<{ vetId: string; horario: string } | null>(null);

  const dataISO = dateToISO(data);

  const vetsFiltrados = useMemo(
    () =>
      veterinarios.filter(
        (v) =>
          (unidadeF === "todas" || v.unidadeId === unidadeF) &&
          (especF === "todas" || v.especialidadeId === especF) &&
          (vetF === "todos" || v.id === vetF),
      ),
    [unidadeF, especF, vetF],
  );

  const agsDoDia = useMemo(
    () =>
      agendamentos.filter((a) => {
        if (a.dataISO !== dataISO) return false;
        if (statusF !== "todos" && (a.status ?? "pendente") !== statusF) return false;
        if (busca.trim()) {
          const q = busca.toLowerCase();
          if (
            !`${a.tutorNome ?? ""} ${a.animalNome ?? ""} ${a.protocolo}`.toLowerCase().includes(q)
          )
            return false;
        }
        if (!vetsFiltrados.find((v) => v.id === a.profissionalId)) return false;
        return true;
      }),
    [agendamentos, dataISO, statusF, busca, vetsFiltrados],
  );

  const kpis = useMemo(() => {
    const total = agsDoDia.length;
    const confirmados = agsDoDia.filter((a) => a.status === "confirmado" || a.status === "check-in").length;
    const concluidos = agsDoDia.filter((a) => a.status === "concluido").length;
    const slots = vetsFiltrados.length * SLOTS.length;
    const ocup = slots > 0 ? Math.round((total / slots) * 100) : 0;
    return { total, confirmados, concluidos, ocup };
  }, [agsDoDia, vetsFiltrados]);

  const navDia = (delta: number) => {
    const d = new Date(data);
    d.setDate(d.getDate() + delta);
    setData(d);
  };

  const abrirNovo = (vetId?: string, horario?: string) => {
    if (vetId && horario) setSlotPre({ vetId, horario });
    else setSlotPre(null);
    setNovoAberto(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Equipe</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão de horários por unidade, especialidade e profissional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navDia(-1)} aria-label="Dia anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setData(new Date())}>
            <CalendarDays className="mr-2 h-4 w-4" /> Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => navDia(1)} aria-label="Próximo dia">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => abrirNovo()}>
            <Plus className="mr-2 h-4 w-4" /> Novo agendamento
          </Button>
        </div>
      </div>

      <div className="text-sm font-medium capitalize text-foreground">{fmtData(dataISO)}</div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={<CalendarDays className="h-4 w-4" />} label="Agendamentos do dia" valor={kpis.total} />
        <KPI icon={<CheckCircle2 className="h-4 w-4 text-success" />} label="Confirmados / check-in" valor={kpis.confirmados} />
        <KPI icon={<Stethoscope className="h-4 w-4 text-violet-500" />} label="Concluídos" valor={kpis.concluidos} />
        <KPI icon={<Users className="h-4 w-4 text-primary" />} label="Ocupação" valor={`${kpis.ocup}%`} />
      </div>

      {/* Filtros */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filtros
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar tutor, animal ou protocolo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={unidadeF} onValueChange={setUnidadeF}>
            <SelectTrigger><SelectValue placeholder="Unidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              {municipio.unidades.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={especF} onValueChange={setEspecF}>
            <SelectTrigger><SelectValue placeholder="Especialidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as especialidades</SelectItem>
              {especialidadesAtivas().map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vetF} onValueChange={setVetF}>
            <SelectTrigger><SelectValue placeholder="Profissional" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os profissionais</SelectItem>
              {veterinarios.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {vetsFiltrados.length === 0 ? (
            <div className="flex h-64 items-center justify-center p-8 text-center text-sm text-muted-foreground">
              Nenhum profissional corresponde aos filtros aplicados.
            </div>
          ) : (
            <div className="overflow-auto">
              <div
                className="grid min-w-fit"
                style={{ gridTemplateColumns: `72px repeat(${vetsFiltrados.length}, minmax(180px, 1fr))` }}
              >
                {/* Header */}
                <div className="sticky left-0 top-0 z-20 border-b border-r border-border bg-muted/40 px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Horário
                </div>
                {vetsFiltrados.map((v) => (
                  <div key={v.id} className="sticky top-0 z-10 border-b border-r border-border bg-muted/40 px-3 py-3 last:border-r-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {v.iniciais}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{v.nome}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{nomeEspecialidade(v.especialidadeId)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slot rows */}
                {SLOTS.map((slot) => (
                  <SlotRow
                    key={slot}
                    slot={slot}
                    vets={vetsFiltrados}
                    ags={agsDoDia}
                    onAbrir={(a) => setSelecionado(a)}
                    onNovo={abrirNovo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista lateral */}
        <aside className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">Lista do dia</div>
            <div className="text-xs text-muted-foreground">{agsDoDia.length} agendamento(s)</div>
          </div>
          <div className="max-h-[600px] divide-y divide-border overflow-auto">
            {agsDoDia.length === 0 ? (
              <div className="flex h-32 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                Sem agendamentos para os filtros atuais.
              </div>
            ) : (
              agsDoDia
                .slice()
                .sort((a, b) => a.horario.localeCompare(b.horario))
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelecionado(a)}
                    className="block w-full px-4 py-3 text-left transition hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {a.horario}
                      </div>
                      <StatusBadge status={a.status ?? "pendente"} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{a.animalNome ?? "Animal"} · {a.tutorNome ?? "Tutor"}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {a.especialidadeNome} · {a.profissionalNome ?? "Profissional"}
                    </div>
                  </button>
                ))
            )}
          </div>
        </aside>
      </div>

      {/* Detalhes */}
      <Dialog open={!!selecionado} onOpenChange={(o) => !o && setSelecionado(null)}>
        <DialogContent>
          {selecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selecionado.animalNome ?? "Animal"}</span>
                  <StatusBadge status={selecionado.status ?? "pendente"} />
                </DialogTitle>
                <DialogDescription>
                  Protocolo {selecionado.protocolo} · {fmtData(selecionado.dataISO)} às {selecionado.horario}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <Linha k="Tutor" v={selecionado.tutorNome ?? "—"} />
                <Linha k="Especialidade" v={selecionado.especialidadeNome} />
                <Linha k="Profissional" v={selecionado.profissionalNome ?? "—"} />
                <Linha
                  k="Unidade"
                  v={municipio.unidades.find((u) => u.id === selecionado.unidadeId)?.nome ?? "—"}
                />
                {selecionado.observacoes && <Linha k="Observações" v={selecionado.observacoes} />}
              </div>
              <DialogFooter className="flex-wrap gap-2 sm:justify-start">
                <AcaoStatus ag={selecionado} novo="confirmado" onUpdate={atualizarStatusAgendamento} setSel={setSelecionado}>
                  Confirmar
                </AcaoStatus>
                <AcaoStatus ag={selecionado} novo="check-in" onUpdate={atualizarStatusAgendamento} setSel={setSelecionado}>
                  Check-in
                </AcaoStatus>
                <AcaoStatus ag={selecionado} novo="em-atendimento" onUpdate={atualizarStatusAgendamento} setSel={setSelecionado}>
                  Iniciar
                </AcaoStatus>
                <AcaoStatus ag={selecionado} novo="concluido" onUpdate={atualizarStatusAgendamento} setSel={setSelecionado}>
                  Concluir
                </AcaoStatus>
                <AcaoStatus ag={selecionado} novo="falta" variant="outline" onUpdate={atualizarStatusAgendamento} setSel={setSelecionado}>
                  Faltou
                </AcaoStatus>
                <Button
                  variant="destructive"
                  onClick={() => {
                    removerAgendamento(selecionado.id);
                    toast.success("Agendamento removido");
                    setSelecionado(null);
                  }}
                >
                  <X className="mr-1 h-4 w-4" /> Excluir
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Novo */}
      <NovoAgendamentoDialog
        aberto={novoAberto}
        onClose={() => setNovoAberto(false)}
        dataPadrao={dataISO}
        slotPre={slotPre}
        onCriar={(p) => {
          criarAgendamento(p);
          toast.success("Agendamento criado", { description: `${p.tutorNome} · ${p.horario}` });
        }}
      />
    </div>
  );
}

function KPI({ icon, label, valor }: { icon: React.ReactNode; label: string; valor: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{valor}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusAgendamento }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold", m.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} /> {m.label}
    </span>
  );
}

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}

function AcaoStatus({
  ag,
  novo,
  onUpdate,
  setSel,
  variant = "default",
  children,
}: {
  ag: Agendamento;
  novo: StatusAgendamento;
  onUpdate: (id: string, s: StatusAgendamento) => void;
  setSel: (a: Agendamento | null) => void;
  variant?: "default" | "outline";
  children: React.ReactNode;
}) {
  const disabled = ag.status === novo;
  return (
    <Button
      size="sm"
      variant={variant}
      disabled={disabled}
      onClick={() => {
        onUpdate(ag.id, novo);
        setSel({ ...ag, status: novo });
        toast.success(`Status: ${STATUS_META[novo].label}`);
      }}
    >
      {children}
    </Button>
  );
}

function SlotRow({
  slot,
  vets,
  ags,
  onAbrir,
  onNovo,
}: {
  slot: string;
  vets: typeof veterinarios;
  ags: Agendamento[];
  onAbrir: (a: Agendamento) => void;
  onNovo: (vetId?: string, horario?: string) => void;
}) {
  return (
    <>
      <div className="sticky left-0 z-10 border-b border-r border-border bg-card px-2 py-2 text-xs font-medium text-muted-foreground">
        {slot}
      </div>
      {vets.map((v) => {
        const a = ags.find((x) => x.profissionalId === v.id && x.horario === slot);
        return (
          <div key={v.id + slot} className="group relative min-h-[56px] border-b border-r border-border last:border-r-0">
            {a ? (
              <button
                onClick={() => onAbrir(a)}
                className={cn(
                  "absolute inset-1 flex flex-col items-start justify-center rounded-lg border px-2 py-1 text-left transition hover:shadow-md",
                  STATUS_META[a.status ?? "pendente"].cls,
                )}
              >
                <div className="truncate text-xs font-semibold">{a.animalNome}</div>
                <div className="truncate text-[10px] opacity-80">{a.tutorNome}</div>
              </button>
            ) : (
              <button
                onClick={() => onNovo(v.id, slot)}
                className="absolute inset-0 flex items-center justify-center text-muted-foreground/0 transition hover:bg-primary-50/50 hover:text-primary group-hover:text-muted-foreground"
                aria-label={`Criar agendamento para ${v.nome} às ${slot}`}
              >
                <Plus className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}

function NovoAgendamentoDialog({
  aberto,
  onClose,
  dataPadrao,
  slotPre,
  onCriar,
}: {
  aberto: boolean;
  onClose: () => void;
  dataPadrao: string;
  slotPre: { vetId: string; horario: string } | null;
  onCriar: (p: Omit<Agendamento, "id" | "protocolo" | "criadoEm">) => void;
}) {
  const [tutor, setTutor] = useState("");
  const [animal, setAnimal] = useState("");
  const [vetId, setVetId] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [dataLocal, setDataLocal] = useState(dataPadrao);
  const [obs, setObs] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // sync prefill quando abrir
  useMemo(() => {
    if (aberto) {
      setTutor("");
      setAnimal("");
      setObs("");
      setErro(null);
      setDataLocal(dataPadrao);
      setVetId(slotPre?.vetId ?? "");
      setHora(slotPre?.horario ?? "");
    }
  }, [aberto, dataPadrao, slotPre]);

  const submit = () => {
    if (!tutor.trim() || !animal.trim() || !vetId || !hora) {
      setErro("Preencha tutor, animal, profissional e horário.");
      return;
    }
    const v = veterinarios.find((x) => x.id === vetId)!;
    onCriar({
      especialidadeId: v.especialidadeId,
      especialidadeNome: nomeEspecialidade(v.especialidadeId),
      dataISO: dataLocal,
      horario: hora,
      status: "pendente",
      profissionalId: v.id,
      profissionalNome: v.nome,
      unidadeId: v.unidadeId,
      tutorNome: tutor.trim(),
      animalNome: animal.trim(),
      duracaoMin: 30,
      observacoes: obs.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo agendamento</DialogTitle>
          <DialogDescription>Preencha os dados para encaixar na agenda.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Tutor"><Input value={tutor} onChange={(e) => setTutor(e.target.value)} placeholder="Nome do tutor" /></Campo>
            <Campo label="Animal"><Input value={animal} onChange={(e) => setAnimal(e.target.value)} placeholder="Nome do animal" /></Campo>
          </div>
          <Campo label="Profissional">
            <Select value={vetId} onValueChange={setVetId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {veterinarios.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.nome} · {nomeEspecialidade(v.especialidadeId)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Data"><Input type="date" value={dataLocal} onChange={(e) => setDataLocal(e.target.value)} /></Campo>
            <Campo label="Horário">
              <Select value={hora} onValueChange={setHora}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Campo>
          </div>
          <Campo label="Observações (opcional)">
            <Textarea rows={3} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Notas internas, motivo, etc." />
          </Campo>
          {erro && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {erro}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>Criar agendamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

// Badge re-export to avoid tree-shake removing in some builds
export const _b = Badge;
