import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  FlaskConical,
  TestTube2,
  CheckCircle2,
  FileText,
  Beaker,
  Filter,
  Save,
  Send,
  Clock,
  User2,
  PawPrint,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/data/store";
import { cn } from "@/lib/utils";
import { categoriasExames, itensDaCategoria } from "@/data/exames-catalogo";
import { toast } from "sonner";

export const Route = createFileRoute("/_equipe/painel/laboratorio")({
  head: () => ({ meta: [{ title: "Laboratório. Vitalis Belém" }] }),
  component: Laboratorio,
});

function acharExameLab(id: string): { label: string; categoria: string } | null {
  for (const cat of categoriasExames) {
    if (cat.id === "imagem") continue;
    const item = itensDaCategoria(cat).find((i) => i.id === id);
    if (item) return { label: item.label, categoria: cat.nome };
  }
  return null;
}

type Prioridade = "urgente" | "alta" | "normal";
type StatusLab = "solicitado" | "em_analise" | "concluido";

interface SolicitacaoLab {
  key: string;
  diagnosticoId: string;
  exameId: string;
  exameLabel: string;
  categoria: string;
  pacienteNome: string;
  especie: string;
  raca: string;
  peso: string;
  tutorNome: string;
  solicitanteNome: string;
  protocolo?: string;
  justificativa: string;
  observacoesExame: string;
  suspeita: string;
  historico: string;
  criadoEm: string;
  status: StatusLab;
  prioridade: Prioridade;
}

interface ParametroResultado {
  parametro: string;
  resultado: string;
  unidade: string;
  referencia: string;
  alterado?: boolean;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function inicialDe(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function prioridadeDe(key: string): Prioridade {
  const n = hashSeed(key) % 10;
  if (n < 2) return "urgente";
  if (n < 5) return "alta";
  return "normal";
}

function resultadosFakeHemograma(seed: number): ParametroResultado[] {
  const r = (min: number, max: number, dec = 1) => {
    const v = min + ((seed % 1000) / 1000) * (max - min);
    return v.toFixed(dec);
  };
  const hem = parseFloat(r(4.5, 8.5, 2));
  return [
    { parametro: "Hemácias", resultado: hem.toFixed(2), unidade: "milhões/µL", referencia: "5.5 - 8.5", alterado: hem < 5.5 },
    { parametro: "Hemoglobina", resultado: r(10, 18), unidade: "g/dL", referencia: "12.0 - 18.0" },
    { parametro: "Hematócrito", resultado: r(30, 55), unidade: "%", referencia: "37 - 55" },
    { parametro: "VCM", resultado: r(60, 77), unidade: "fL", referencia: "60 - 77" },
    { parametro: "Leucócitos", resultado: r(6, 18, 0), unidade: "/µL", referencia: "6.000 - 17.000" },
    { parametro: "Neutrófilos segmentados", resultado: r(60, 77, 0), unidade: "%", referencia: "60 - 77" },
    { parametro: "Linfócitos", resultado: r(12, 30, 0), unidade: "%", referencia: "12 - 30" },
    { parametro: "Plaquetas", resultado: r(180, 480, 0), unidade: "10³/µL", referencia: "200 - 500" },
  ];
}

function resultadosFakeBioquimica(seed: number): ParametroResultado[] {
  const r = (min: number, max: number, dec = 1) => {
    const v = min + (((seed >> 3) % 1000) / 1000) * (max - min);
    return v.toFixed(dec);
  };
  const ureia = parseFloat(r(15, 90));
  return [
    { parametro: "Ureia", resultado: ureia.toFixed(1), unidade: "mg/dL", referencia: "21.4 - 59.9", alterado: ureia > 59.9 },
    { parametro: "Creatinina", resultado: r(0.5, 2.2, 2), unidade: "mg/dL", referencia: "0.5 - 1.5" },
    { parametro: "ALT (TGP)", resultado: r(10, 90, 0), unidade: "U/L", referencia: "21 - 102" },
    { parametro: "AST (TGO)", resultado: r(10, 70, 0), unidade: "U/L", referencia: "23 - 66" },
    { parametro: "Fosfatase alcalina", resultado: r(20, 150, 0), unidade: "U/L", referencia: "20 - 156" },
    { parametro: "Glicose", resultado: r(60, 130, 0), unidade: "mg/dL", referencia: "65 - 118" },
    { parametro: "Proteína total", resultado: r(5, 8, 1), unidade: "g/dL", referencia: "5.4 - 7.5" },
  ];
}

function Laboratorio() {
  const diagnosticos = useStore((s) => s.diagnosticos);
  const atualizarStatusExame = useStore((s) => s.atualizarStatusExame);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPrio, setFiltroPrio] = useState<string>("todas");
  const [selecionadoKey, setSelecionadoKey] = useState<string | null>(null);
  const [conclusao, setConclusao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [responsavel, setResponsavel] = useState("Dr(a). Responsável Técnico");

  const solicitacoes = useMemo<SolicitacaoLab[]>(() => {
    const lista: SolicitacaoLab[] = [];
    for (const d of diagnosticos) {
      const c = d.conteudo as Record<string, unknown>;
      const exames = (c.examesSolicitados as string[] | undefined) ?? [];
      const statusMap = (c.statusExames as Record<string, StatusLab> | undefined) ?? {};
      for (const exId of exames) {
        const info = acharExameLab(exId);
        if (!info) continue;
        const key = `${d.id}:${exId}`;
        lista.push({
          key,
          diagnosticoId: d.id,
          exameId: exId,
          exameLabel: info.label,
          categoria: info.categoria,
          pacienteNome: String(c.pacienteNome ?? "Paciente"),
          especie: String(c.especie ?? ""),
          raca: String(c.raca ?? ""),
          peso: String(c.peso ?? "—"),
          tutorNome: String(c.tutorNome ?? ""),
          solicitanteNome: String(c.solicitanteNome ?? "Equipe clínica"),
          protocolo: c.protocolo as string | undefined,
          justificativa: String(c.justificativa ?? ""),
          observacoesExame: String(c.observacoesExame ?? ""),
          suspeita: String(c.suspeitaPrincipal ?? ""),
          historico: String(c.historico ?? c.anamnese ?? ""),
          criadoEm: d.criadoEm,
          status: statusMap[exId] ?? "solicitado",
          prioridade: prioridadeDe(key),
        });
      }
    }
    return lista;
  }, [diagnosticos]);

  const filtrados = useMemo(
    () =>
      solicitacoes.filter((s) => {
        if (filtroStatus !== "todos" && s.status !== filtroStatus) return false;
        if (filtroPrio !== "todas" && s.prioridade !== filtroPrio) return false;
        return `${s.pacienteNome} ${s.exameLabel} ${s.tutorNome}`
          .toLowerCase()
          .includes(busca.toLowerCase());
      }),
    [solicitacoes, busca, filtroStatus, filtroPrio],
  );

  const hoje = new Date().toDateString();
  const stats = [
    {
      label: "Em análise",
      valor: solicitacoes.filter((s) => s.status === "em_analise").length,
      Icon: FlaskConical,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      label: "Aguardando coleta",
      valor: solicitacoes.filter((s) => s.status === "solicitado").length,
      Icon: TestTube2,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      label: "Coletas hoje",
      valor: solicitacoes.filter(
        (s) => s.status !== "solicitado" && new Date(s.criadoEm).toDateString() === hoje,
      ).length,
      Icon: Beaker,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Laudos hoje",
      valor: solicitacoes.filter(
        (s) => s.status === "concluido" && new Date(s.criadoEm).toDateString() === hoje,
      ).length,
      Icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Pendentes de revisão",
      valor: solicitacoes.filter((s) => s.status === "em_analise").length,
      Icon: AlertTriangle,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
  ];

  const selecionado = useMemo(
    () => filtrados.find((s) => s.key === selecionadoKey) ?? filtrados[0] ?? null,
    [filtrados, selecionadoKey],
  );

  useEffect(() => {
    setConclusao("");
    setObservacoes("");
  }, [selecionado?.key]);

  const seed = selecionado ? hashSeed(selecionado.key) : 0;
  const hemograma = useMemo(() => resultadosFakeHemograma(seed), [seed]);
  const bioquimica = useMemo(() => resultadosFakeBioquimica(seed), [seed]);

  const iniciarAnalise = (s: SolicitacaoLab) =>
    atualizarStatusExame(s.diagnosticoId, s.exameId, "em_analise");

  const finalizarLaudo = () => {
    if (!selecionado) return;
    atualizarStatusExame(selecionado.diagnosticoId, selecionado.exameId, "concluido");
    toast.success("Laudo finalizado", { description: `${selecionado.exameLabel} — ${selecionado.pacienteNome}` });
  };

  const statusPill = (st: StatusLab) => {
    const map: Record<StatusLab, { label: string; cls: string; dot: string }> = {
      solicitado: {
        label: "Aguardando coleta",
        cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        dot: "bg-amber-500",
      },
      em_analise: {
        label: "Em processamento",
        cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
        dot: "bg-blue-500",
      },
      concluido: {
        label: "Finalizado",
        cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        dot: "bg-emerald-500",
      },
    };
    const b = map[st];
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold", b.cls)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", b.dot)} />
        {b.label}
      </span>
    );
  };

  const prioPill = (p: Prioridade) => {
    const map: Record<Prioridade, string> = {
      urgente: "bg-red-50 text-red-700 ring-1 ring-red-100",
      alta: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
      normal: "bg-slate-50 text-slate-600 ring-1 ring-slate-100",
    };
    const label: Record<Prioridade, string> = { urgente: "Urgente", alta: "Alta", normal: "Normal" };
    return (
      <span className={cn("inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[p])}>
        {label[p]}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Laboratório Clínico
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestão de exames laboratoriais, análises e emissão de laudos
          </p>
        </div>
      </div>

      {/* Indicadores */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const I = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                <span className={cn("grid h-8 w-8 place-items-center rounded-lg ring-1", s.tone)}>
                  <I className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900">{s.valor}</p>
            </div>
          );
        })}
      </div>

      {/* Grid principal */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Lista lateral */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar paciente, exame ou tutor..."
                className="pl-9"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="h-9 text-xs">
                  <Filter className="mr-1 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos status</SelectItem>
                  <SelectItem value="solicitado">Aguardando</SelectItem>
                  <SelectItem value="em_analise">Em análise</SelectItem>
                  <SelectItem value="concluido">Finalizados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroPrio} onValueChange={setFiltroPrio}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas prioridades</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-2">
            {filtrados.length === 0 ? (
              <div className="p-8 text-center">
                <Beaker className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-700">Nenhuma solicitação</p>
                <p className="text-xs text-slate-500">Aguardando pedidos da Ficha Médica.</p>
              </div>
            ) : (
              filtrados.map((s) => {
                const ativo = selecionado?.key === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSelecionadoKey(s.key)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-all",
                      ativo
                        ? "border-blue-200 bg-blue-50/60 ring-1 ring-blue-100"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-xs font-bold text-white">
                        {inicialDe(s.pacienteNome)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{s.pacienteNome}</p>
                          {prioPill(s.prioridade)}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {s.especie}{s.raca ? ` · ${s.raca}` : ""} · Tutor: {s.tutorNome || "—"}
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-700">{s.exameLabel}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="h-3 w-3" />
                            {formatarData(s.criadoEm)}
                          </span>
                          {statusPill(s.status)}
                        </div>
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          Solicitante: {s.solicitanteNome}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Painel central */}
        {selecionado ? (
          <div className="space-y-4">
            {/* Header paciente */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-lg font-bold text-white shadow-sm">
                    {inicialDe(selecionado.pacienteNome)}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-slate-900">
                      {selecionado.pacienteNome}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <PawPrint className="h-3.5 w-3.5" />
                        {selecionado.especie}{selecionado.raca ? ` · ${selecionado.raca}` : ""}
                      </span>
                      <span>Peso: {selecionado.peso}</span>
                      <span className="inline-flex items-center gap-1">
                        <User2 className="h-3.5 w-3.5" />
                        Tutor: {selecionado.tutorNome || "—"}
                      </span>
                      {selecionado.protocolo && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700">
                          {selecionado.protocolo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusPill(selecionado.status)}
                  {prioPill(selecionado.prioridade)}
                  {selecionado.status === "solicitado" && (
                    <Button size="sm" variant="outline" onClick={() => iniciarAnalise(selecionado)}>
                      Iniciar análise
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Info clínica */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Motivo</p>
                <p className="mt-1 text-sm text-slate-900">
                  {selecionado.justificativa || "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Suspeita clínica</p>
                <p className="mt-1 text-sm text-slate-900">{selecionado.suspeita || "—"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Histórico</p>
                <p className="mt-1 text-sm text-slate-900">
                  {selecionado.historico || selecionado.observacoesExame || "Sem histórico adicional."}
                </p>
              </div>
            </div>

            {/* Resultados */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    Resultados — {selecionado.exameLabel}
                  </h3>
                  <p className="text-xs text-slate-500">{selecionado.categoria}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Solicitado por {selecionado.solicitanteNome}
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
                <TabelaResultados titulo="Hemograma" linhas={hemograma} />
                <TabelaResultados titulo="Bioquímica sérica" linhas={bioquimica} />
              </div>
            </div>

            {/* Editor de laudo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Laudo laboratorial</h3>
                  <p className="text-xs text-slate-500">Editor para conclusão e liberação ao veterinário.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100">
                  Editor
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Conclusão</label>
                  <Textarea
                    value={conclusao}
                    onChange={(e) => setConclusao(e.target.value)}
                    placeholder="Ex.: Achados compatíveis com quadro inflamatório leve. Sem alterações renais significativas..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Observações técnicas</label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex.: Amostra levemente hemolisada. Recomenda-se repetir dosagem de potássio em 48h..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Responsável técnico</label>
                  <Input
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={() => toast("Rascunho salvo")}>
                    <Save className="mr-1.5 h-4 w-4" />
                    Salvar rascunho
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      finalizarLaudo();
                    }}
                  >
                    <FileText className="mr-1.5 h-4 w-4" />
                    Finalizar laudo
                  </Button>
                  <Button
                    onClick={() => {
                      finalizarLaudo();
                      toast.success("Liberado para veterinário");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="mr-1.5 h-4 w-4" />
                    Liberar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
            <div>
              <Beaker className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-display text-base font-semibold text-slate-900">
                Selecione um exame para começar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                As solicitações da Ficha Médica aparecem na lista à esquerda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabelaResultados({ titulo, linhas }: { titulo: string; linhas: ParametroResultado[] }) {
  return (
    <div className="p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{titulo}</p>
      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Parâmetro</th>
              <th className="px-3 py-2">Resultado</th>
              <th className="px-3 py-2">Unidade</th>
              <th className="px-3 py-2">Referência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {linhas.map((l) => (
              <tr key={l.parametro} className="hover:bg-slate-50/60">
                <td className="px-3 py-2 text-slate-700">{l.parametro}</td>
                <td
                  className={cn(
                    "px-3 py-2 font-semibold",
                    l.alterado ? "text-red-600" : "text-slate-900",
                  )}
                >
                  {l.resultado}
                  {l.alterado && (
                    <span className="ml-1 rounded bg-red-50 px-1 py-0.5 text-[9px] font-bold text-red-600 ring-1 ring-red-100">
                      ALT
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-500">{l.unidade}</td>
                <td className="px-3 py-2 text-slate-500">{l.referencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
