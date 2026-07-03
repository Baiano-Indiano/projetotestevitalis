import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Clock,
  FlaskConical,
  CheckCircle2,
  FileText,
  ScanLine,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Contrast,
  Maximize2,
  Ruler,
  Sun,
  Download,
  Send,
  Save,
  User2,
  PawPrint,
  AlertTriangle,
  Filter,
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
import { categoriasImagem, itensDaCategoriaImagem } from "@/data/imagem-catalogo";
import { toast } from "sonner";

export const Route = createFileRoute("/_equipe/painel/imagem")({
  head: () => ({ meta: [{ title: "Exames de Imagem. Vitalis Belém" }] }),
  component: ImagemRoute,
});

function acharExameImagem(id: string): { label: string; categoria: string } | null {
  for (const cat of categoriasImagem) {
    const item = itensDaCategoriaImagem(cat).find((i) => i.id === id);
    if (item) return { label: item.label, categoria: cat.nome };
  }
  return null;
}

type StatusImg = "solicitado" | "em_analise" | "concluido";
type Prioridade = "urgente" | "alta" | "normal";

interface SolicitacaoImg {
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
  status: StatusImg;
  prioridade: Prioridade;
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

// Placeholders de imagens médicas (Unsplash - domínio veterinário/radiologia)
const IMAGENS_PLACEHOLDER = [
  "https://images.unsplash.com/photo-1516069677018-378515003435?w=1200&q=80",
  "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80",
  "https://images.unsplash.com/photo-1583912267550-7d47dad6bc35?w=1200&q=80",
];

function ImagemRoute() {
  const diagnosticos = useStore((s) => s.diagnosticos);
  const atualizarStatusExame = useStore((s) => s.atualizarStatusExame);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [selecionadoKey, setSelecionadoKey] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [interpretacao, setInterpretacao] = useState("");
  const [conclusao, setConclusao] = useState("");
  const [zoom, setZoom] = useState(100);
  const [rotacao, setRotacao] = useState(0);
  const [brilho, setBrilho] = useState(100);
  const [contraste, setContraste] = useState(100);

  const solicitacoes = useMemo<SolicitacaoImg[]>(() => {
    const lista: SolicitacaoImg[] = [];
    for (const d of diagnosticos) {
      const c = d.conteudo as Record<string, unknown>;
      const exames = (c.examesSolicitados as string[] | undefined) ?? [];
      const statusMap = (c.statusExames as Record<string, StatusImg> | undefined) ?? {};
      for (const exId of exames) {
        const info = acharExameImagem(exId);
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
        return `${s.pacienteNome} ${s.exameLabel} ${s.tutorNome}`
          .toLowerCase()
          .includes(busca.toLowerCase());
      }),
    [solicitacoes, busca, filtroStatus],
  );

  const hoje = new Date().toDateString();
  const stats = [
    {
      label: "Aguardando",
      valor: solicitacoes.filter((s) => s.status === "solicitado").length,
      Icon: Clock,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      label: "Em análise",
      valor: solicitacoes.filter((s) => s.status === "em_analise").length,
      Icon: FlaskConical,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      label: "Laudos emitidos hoje",
      valor: solicitacoes.filter(
        (s) => s.status === "concluido" && new Date(s.criadoEm).toDateString() === hoje,
      ).length,
      Icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Urgentes",
      valor: solicitacoes.filter((s) => s.prioridade === "urgente" && s.status !== "concluido").length,
      Icon: AlertTriangle,
      tone: "bg-red-50 text-red-700 ring-red-100",
    },
  ];

  const selecionado = useMemo(
    () => filtrados.find((s) => s.key === selecionadoKey) ?? filtrados[0] ?? null,
    [filtrados, selecionadoKey],
  );

  useEffect(() => {
    setDescricao("");
    setInterpretacao("");
    setConclusao("");
    setZoom(100);
    setRotacao(0);
    setBrilho(100);
    setContraste(100);
  }, [selecionado?.key]);

  const imgUrl = selecionado
    ? IMAGENS_PLACEHOLDER[hashSeed(selecionado.key) % IMAGENS_PLACEHOLDER.length]
    : IMAGENS_PLACEHOLDER[0];

  const iniciarAnalise = (s: SolicitacaoImg) =>
    atualizarStatusExame(s.diagnosticoId, s.exameId, "em_analise");

  const finalizar = () => {
    if (!selecionado) return;
    atualizarStatusExame(selecionado.diagnosticoId, selecionado.exameId, "concluido");
    toast.success("Laudo finalizado", { description: selecionado.exameLabel });
  };

  const statusPill = (st: StatusImg) => {
    const map: Record<StatusImg, { label: string; cls: string; dot: string }> = {
      solicitado: { label: "Aguardando", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100", dot: "bg-amber-500" },
      em_analise: { label: "Em análise", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-100", dot: "bg-blue-500" },
      concluido: { label: "Laudo emitido", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100", dot: "bg-emerald-500" },
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
            Diagnóstico por Imagem
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualização, análise e laudo de exames radiológicos e ultrassonográficos
          </p>
        </div>
      </div>

      {/* Indicadores */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
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
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        {/* Lista lateral */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar paciente ou exame..."
                className="pl-9"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="mt-2 h-9 text-xs">
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
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-2">
            {filtrados.length === 0 ? (
              <div className="p-8 text-center">
                <ScanLine className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-700">Nenhum exame</p>
                <p className="text-xs text-slate-500">Solicitações aparecerão aqui.</p>
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
                          {s.especie}{s.raca ? ` · ${s.raca}` : ""}
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-700">{s.exameLabel}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="h-3 w-3" /> {formatarData(s.criadoEm)}
                          </span>
                          {statusPill(s.status)}
                        </div>
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          Sol.: {s.solicitanteNome}
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
                        {selecionado.tutorNome || "—"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700">
                        {selecionado.exameLabel}
                      </span>
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

            {/* Visualizador */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 p-3">
                <div className="flex items-center gap-1">
                  <ToolBtn Icon={ZoomIn} onClick={() => setZoom((z) => Math.min(300, z + 20))} label="Zoom +" />
                  <ToolBtn Icon={ZoomOut} onClick={() => setZoom((z) => Math.max(40, z - 20))} label="Zoom -" />
                  <ToolBtn Icon={Move} label="Pan" />
                  <ToolBtn Icon={RotateCw} onClick={() => setRotacao((r) => (r + 90) % 360)} label="Rotação" />
                  <ToolBtn Icon={Contrast} onClick={() => setContraste((c) => (c >= 150 ? 100 : c + 25))} label="Contraste" />
                  <ToolBtn Icon={Sun} onClick={() => setBrilho((b) => (b >= 150 ? 100 : b + 25))} label="Brilho" />
                  <ToolBtn Icon={Ruler} label="Medir" />
                  <ToolBtn Icon={Maximize2} label="Tela cheia" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Zoom {zoom}%</span>
                  <span>·</span>
                  <span>Rot {rotacao}°</span>
                </div>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src={imgUrl}
                  alt={selecionado.exameLabel}
                  className="h-full w-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotacao}deg)`,
                    filter: `brightness(${brilho}%) contrast(${contraste}%)`,
                  }}
                />
                {/* Overlay corner info */}
                <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-emerald-300">
                  {selecionado.pacienteNome.toUpperCase()} · {selecionado.especie.toUpperCase()}
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-emerald-300">
                  {selecionado.exameLabel}
                </div>
                <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-emerald-300">
                  {formatarData(selecionado.criadoEm)}
                </div>
              </div>
            </div>

            {/* Info clínica */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Motivo do exame</p>
                <p className="mt-1 text-sm text-slate-900">{selecionado.justificativa || "—"}</p>
                {selecionado.suspeita && (
                  <p className="mt-2 text-xs text-slate-500">
                    Suspeita: <span className="font-medium text-slate-700">{selecionado.suspeita}</span>
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Histórico</p>
                <p className="mt-1 text-sm text-slate-900">
                  {selecionado.historico || selecionado.observacoesExame || "Sem histórico adicional."}
                </p>
              </div>
            </div>

            {/* Laudo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Emissão do laudo</h3>
                  <p className="text-xs text-slate-500">Descrição, interpretação e conclusão radiológica.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Radiologista
                </span>
              </div>

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Descrição dos achados</label>
                  <Textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex.: Imagem radiopaca em campo pulmonar caudal direito, medindo aproximadamente 2,3 cm..."
                    className="mt-1 min-h-[110px]"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Interpretação</label>
                    <Textarea
                      value={interpretacao}
                      onChange={(e) => setInterpretacao(e.target.value)}
                      placeholder="Ex.: Padrão compatível com processo pneumônico focal..."
                      className="mt-1 min-h-[110px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Conclusão</label>
                    <Textarea
                      value={conclusao}
                      onChange={(e) => setConclusao(e.target.value)}
                      placeholder="Ex.: Sugere-se correlação clínica e complementação com tomografia..."
                      className="mt-1 min-h-[110px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => toast("Rascunho salvo")}>
                  <Save className="mr-1.5 h-4 w-4" />
                  Salvar rascunho
                </Button>
                <Button variant="outline" onClick={() => toast.success("PDF exportado")}>
                  <Download className="mr-1.5 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button onClick={finalizar} className="bg-emerald-600 hover:bg-emerald-700">
                  <Send className="mr-1.5 h-4 w-4" />
                  Finalizar laudo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
            <div>
              <ScanLine className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-display text-base font-semibold text-slate-900">
                Selecione um exame de imagem
              </p>
              <p className="mt-1 text-sm text-slate-500">
                As solicitações da Ficha Médica aparecem à esquerda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolBtn({
  Icon,
  label,
  onClick,
}: {
  Icon: typeof ZoomIn;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

// suppress unused FileText import warning if not referenced elsewhere
void FileText;
